from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from web3 import Web3
import json, os

# ---------------------
# Web3 Setup
# ---------------------
w3 = Web3(Web3.HTTPProvider("http://10.105.63.205:8545"))

PRIVATE_KEY = 0x353eb7e4a03eb1ae0f0a58c30c44d8c3c0c9e0e304ecf9310c8aba629a34cbf5
ACCOUNT = w3.eth.account.from_key(PRIVATE_KEY)

# ---------------------
# Load Contracts
# ---------------------
def load_contract(json_file, address):
    with open(json_file, "r") as f:
        contract_data = json.load(f)
    abi = contract_data["abi"]
    return w3.eth.contract(address=Web3.to_checksum_address(address), abi=abi)

# Replace with your deployed contract addresses from Ganache/Truffle migrations
RECORD_REGISTRY_ADDR = 0xC368AD9B744364804391e247D107F115e3c635Ba
MULTISIG_ADDR = 0xC368AD9B744364804391e247D107F115e3c635Ba

record_contract = load_contract(r"C:\Lohith\psg\PULSE\medledger-contracts\build\contracts\RecordRegistry.json", RECORD_REGISTRY_ADDR)
multisig_contract = load_contract(r"C:\Lohith\psg\PULSE\medledger-contracts\build\contracts\MultiSignatureAccess.json", MULTISIG_ADDR)

# ---------------------
# FastAPI
# ---------------------
app = FastAPI(title="MedLedger API")

# ---------------------
# Utils
# ---------------------
def send_txn(fn):
    nonce = w3.eth.get_transaction_count(ACCOUNT.address)
    txn = fn.build_transaction({
        "from": ACCOUNT.address,
        "nonce": nonce,
        "gas": 3_000_000,
        "gasPrice": w3.to_wei("10", "gwei"),
    })
    signed = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    return w3.eth.wait_for_transaction_receipt(tx_hash)

# ---------------------
# RecordRegistry Models
# ---------------------
class RegisterRecordReq(BaseModel):
    patient: str
    dataType: str
    recordType: int
    ipfsHash: str
    metadata: str
    isEncrypted: bool
    encryptionKey: str
    isEmergencyAccessible: bool

class UpdateRecordReq(BaseModel):
    recordId: str
    newIpfsHash: str
    updateReason: str
    newMetadata: str
    newEncryptionKey: str

class DeleteRecordReq(BaseModel):
    recordId: str
    deleteReason: str

# ---------------------
# MultiSig Models
# ---------------------
class SubmitProposalReq(BaseModel):
    description: str
    targetContract: str
    data: str

class VoteReq(BaseModel):
    proposalId: int
    support: bool

# ---------------------
# RecordRegistry Routes
# ---------------------
@app.post("/record/register")
def register_record(req: RegisterRecordReq):
    try:
        fn = record_contract.functions.registerRecord(
            Web3.to_checksum_address(req.patient),
            req.dataType,
            int(req.recordType),
            req.ipfsHash,
            req.metadata,
            bool(req.isEncrypted),
            req.encryptionKey,
            bool(req.isEmergencyAccessible)
        )
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/record/update")
def update_record(req: UpdateRecordReq):
    try:
        fn = record_contract.functions.updateRecord(
            req.recordId, req.newIpfsHash, req.updateReason,
            req.newMetadata, req.newEncryptionKey
        )
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/record/delete")
def delete_record(req: DeleteRecordReq):
    try:
        fn = record_contract.functions.deleteRecord(req.recordId, req.deleteReason)
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/record/{recordId}")
def get_record(recordId: str):
    try:
        # ensure it's a valid bytes32
        if recordId.startswith("0x"):
            record_bytes = recordId
        else:
            # convert plain string into 32-byte hex
            record_bytes = Web3.to_hex(text=recordId).ljust(66, "0")

        details = record_contract.functions.getRecordDetails(record_bytes).call()
        return {"record": details}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Add these models and routes to your existing FastAPI application

# ---------------------
# MultiSignatureAccess Models
# ---------------------
from typing import List, Optional
from enum import IntEnum

class AccessType(IntEnum):
    READ = 0
    WRITE = 1
    UPDATE = 2
    DELETE = 3
    EMERGENCY = 4
    RESEARCH = 5
    INSURANCE = 6
    LEGAL = 7

class ProposalStatus(IntEnum):
    PENDING = 0
    APPROVED = 1
    EXECUTED = 2
    REJECTED = 3
    EXPIRED = 4

class ProposeActionReq(BaseModel):
    patient: str
    dataType: str
    accessType: int  # AccessType enum value
    reason: str
    ipfsHashes: List[str]

class ApproveActionReq(BaseModel):
    proposalId: str

class RejectActionReq(BaseModel):
    proposalId: str
    reason: str

class ExecuteActionReq(BaseModel):
    proposalId: str

class AddApproverReq(BaseModel):
    approver: str
    role: str

class UpdateSignatureRequirementsReq(BaseModel):
    standard: int
    emergency: int
    research: int
    legal: int
    insurance: int

# ---------------------
# MultiSignatureAccess Routes
# ---------------------

@app.post("/multisig/propose")
def propose_action(req: ProposeActionReq):
    """Propose an action that requires multi-signature approval"""
    try:
        fn = multisig_contract.functions.proposeAction(
            Web3.to_checksum_address(req.patient),
            req.dataType,
            int(req.accessType),
            req.reason,
            req.ipfsHashes
        )
        receipt = send_txn(fn)
        
        # Extract proposal ID from transaction receipt logs
        proposal_id = None
        for log in receipt.logs:
            try:
                decoded_log = multisig_contract.events.ProposalCreated().process_log(log)
                proposal_id = decoded_log['args']['proposalId'].hex()
                break
            except:
                continue
        
        return {
            "txHash": receipt.transactionHash.hex(),
            "proposalId": proposal_id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/multisig/approve")
def approve_action(req: ApproveActionReq):
    """Approve a proposal"""
    try:
        # Convert proposal ID to bytes32
        if req.proposalId.startswith("0x"):
            proposal_bytes = req.proposalId
        else:
            proposal_bytes = Web3.to_hex(text=req.proposalId).ljust(66, "0")
        
        fn = multisig_contract.functions.approveAction(proposal_bytes)
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/multisig/reject")
def reject_action(req: RejectActionReq):
    """Reject a proposal"""
    try:
        # Convert proposal ID to bytes32
        if req.proposalId.startswith("0x"):
            proposal_bytes = req.proposalId
        else:
            proposal_bytes = Web3.to_hex(text=req.proposalId).ljust(66, "0")
        
        fn = multisig_contract.functions.rejectAction(proposal_bytes, req.reason)
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/multisig/execute")
def execute_action(req: ExecuteActionReq):
    """Execute an approved proposal"""
    try:
        # Convert proposal ID to bytes32
        if req.proposalId.startswith("0x"):
            proposal_bytes = req.proposalId
        else:
            proposal_bytes = Web3.to_hex(text=req.proposalId).ljust(66, "0")
        
        fn = multisig_contract.functions.executeAction(proposal_bytes)
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/multisig/mark-expired")
def mark_expired(proposalId: str):
    """Mark a proposal as expired"""
    try:
        # Convert proposal ID to bytes32
        if proposalId.startswith("0x"):
            proposal_bytes = proposalId
        else:
            proposal_bytes = Web3.to_hex(text=proposalId).ljust(66, "0")
        
        fn = multisig_contract.functions.markExpired(proposal_bytes)
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposal/{proposalId}")
def get_proposal_details(proposalId: str):
    """Get details of a specific proposal"""
    try:
        # Convert proposal ID to bytes32
        if proposalId.startswith("0x"):
            proposal_bytes = proposalId
        else:
            proposal_bytes = Web3.to_hex(text=proposalId).ljust(66, "0")
        
        details = multisig_contract.functions.getProposalDetails(proposal_bytes).call()
        
        return {
            "proposer": details[0],
            "patient": details[1],
            "dataType": details[2],
            "accessType": details[3],
            "reason": details[4],
            "deadline": details[5],
            "createdAt": details[6],
            "requiredSignatures": details[7],
            "currentApprovals": details[8],
            "status": details[9]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposal/{proposalId}/approvers")
def get_proposal_approvers(proposalId: str):
    """Get list of approvers for a proposal"""
    try:
        # Convert proposal ID to bytes32
        if proposalId.startswith("0x"):
            proposal_bytes = proposalId
        else:
            proposal_bytes = Web3.to_hex(text=proposalId).ljust(66, "0")
        
        approvers = multisig_contract.functions.getProposalApprovers(proposal_bytes).call()
        return {"approvers": approvers}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposal/{proposalId}/ipfs-hashes")
def get_proposal_ipfs_hashes(proposalId: str):
    """Get IPFS hashes associated with a proposal"""
    try:
        # Convert proposal ID to bytes32
        if proposalId.startswith("0x"):
            proposal_bytes = proposalId
        else:
            proposal_bytes = Web3.to_hex(text=proposalId).ljust(66, "0")
        
        hashes = multisig_contract.functions.getProposalIPFSHashes(proposal_bytes).call()
        return {"ipfsHashes": hashes}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposals/status/{status}")
def get_proposals_by_status(status: int):
    """Get all proposals with a specific status"""
    try:
        if status not in [0, 1, 2, 3, 4]:  # Valid ProposalStatus values
            raise HTTPException(status_code=400, detail="Invalid status value")
        
        proposal_ids = multisig_contract.functions.getProposalsByStatus(status).call()
        return {"proposalIds": [pid.hex() for pid in proposal_ids]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposals/proposer/{proposer}")
def get_proposals_by_proposer(proposer: str):
    """Get all proposals by a specific proposer"""
    try:
        proposal_ids = multisig_contract.functions.getProposalsByProposer(
            Web3.to_checksum_address(proposer)
        ).call()
        return {"proposalIds": [pid.hex() for pid in proposal_ids]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposals/approver/{approver}")
def get_proposals_by_approver(approver: str):
    """Get all proposals approved by a specific approver"""
    try:
        proposal_ids = multisig_contract.functions.getProposalsByApprover(
            Web3.to_checksum_address(approver)
        ).call()
        return {"proposalIds": [pid.hex() for pid in proposal_ids]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposal/{proposalId}/approved-by/{approver}")
def has_approved(proposalId: str, approver: str):
    """Check if a proposal has been approved by a specific approver"""
    try:
        # Convert proposal ID to bytes32
        if proposalId.startswith("0x"):
            proposal_bytes = proposalId
        else:
            proposal_bytes = Web3.to_hex(text=proposalId).ljust(66, "0")
        
        approved = multisig_contract.functions.hasApproved(
            proposal_bytes, 
            Web3.to_checksum_address(approver)
        ).call()
        return {"hasApproved": approved}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposals/total")
def get_total_proposals():
    """Get total number of proposals"""
    try:
        total = multisig_contract.functions.getTotalProposals().call()
        return {"totalProposals": total}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/signature-requirements")
def get_signature_requirements():
    """Get signature requirements for different access types"""
    try:
        requirements = multisig_contract.functions.getSignatureRequirements().call()
        return {
            "standard": requirements[0],
            "emergency": requirements[1],
            "research": requirements[2],
            "legal": requirements[3],
            "insurance": requirements[4]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/proposal/{proposalId}/executed")
def is_proposal_executed(proposalId: str):
    """Check if a proposal is executed"""
    try:
        # Convert proposal ID to bytes32
        if proposalId.startswith("0x"):
            proposal_bytes = proposalId
        else:
            proposal_bytes = Web3.to_hex(text=proposalId).ljust(66, "0")
        
        executed = multisig_contract.functions.isProposalExecuted(proposal_bytes).call()
        return {"isExecuted": executed}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/multisig/approver/{approver}")
def get_approver_info(approver: str):
    """Get approver information"""
    try:
        is_authorized = multisig_contract.functions.authorizedApprovers(
            Web3.to_checksum_address(approver)
        ).call()
        role = multisig_contract.functions.approverRoles(
            Web3.to_checksum_address(approver)
        ).call()
        
        return {
            "isAuthorized": is_authorized,
            "role": role
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ---------------------
# Admin-only Routes
# ---------------------

@app.post("/multisig/admin/add-approver")
def add_approver(req: AddApproverReq):
    """Add an authorized approver (admin only)"""
    try:
        fn = multisig_contract.functions.addApprover(
            Web3.to_checksum_address(req.approver),
            req.role
        )
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/multisig/admin/remove-approver")
def remove_approver(approver: str):
    """Remove an authorized approver (admin only)"""
    try:
        fn = multisig_contract.functions.removeApprover(
            Web3.to_checksum_address(approver)
        )
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/multisig/admin/update-signature-requirements")
def update_signature_requirements(req: UpdateSignatureRequirementsReq):
    """Update signature requirements (admin only)"""
    try:
        fn = multisig_contract.functions.updateSignatureRequirements(
            req.standard,
            req.emergency,
            req.research,
            req.legal,
            req.insurance
        )
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/multisig/admin/update-consent-contract")
def update_consent_contract(newConsentContract: str):
    """Update consent contract address (admin only)"""
    try:
        fn = multisig_contract.functions.updateConsentContract(
            Web3.to_checksum_address(newConsentContract)
        )
        receipt = send_txn(fn)
        return {"txHash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))