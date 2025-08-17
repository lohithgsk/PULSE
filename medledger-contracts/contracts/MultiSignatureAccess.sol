// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ConsentManagement.sol";

/**
 * @title MultiSignatureAccess
 * @dev Smart contract for multi-signature access control to medical records
 * @author ARCHBTW Team - MedLedger
 */
contract MultiSignatureAccess {
    
    // Reference to ConsentManagement contract
    ConsentManagement public consentContract;
    
    // Events
    event ProposalCreated(
        bytes32 indexed proposalId,
        address indexed proposer,
        address indexed patient,
        string dataType,
        string reason,
        uint256 deadline,
        uint256 requiredSignatures
    );
    
    event ProposalApproved(
        bytes32 indexed proposalId,
        address indexed approver,
        uint256 currentApprovals,
        uint256 requiredSignatures
    );
    
    event ProposalExecuted(
        bytes32 indexed proposalId,
        address indexed executor,
        bool success,
        uint256 executedAt
    );
    
    event ProposalRejected(
        bytes32 indexed proposalId,
        address indexed rejector,
        string reason
    );
    
    event ProposalExpired(
        bytes32 indexed proposalId,
        uint256 expiredAt
    );
    
    // Enums
    enum ProposalStatus { 
        Pending,        // Waiting for approvals
        Approved,       // Enough signatures collected
        Executed,       // Successfully executed
        Rejected,       // Explicitly rejected
        Expired         // Deadline passed
    }
    
    enum AccessType {
        Read,           // Read medical records
        Write,          // Add new records
        Update,         // Modify existing records
        Delete,         // Remove records (rare)
        Emergency,      // Emergency access (reduced signatures)
        Research,       // Research data access
        Insurance,      // Insurance claim access
        Legal           // Legal/court ordered access
    }
    
    // Structs
    struct Proposal {
        bytes32 proposalId;
        address proposer;
        address patient;
        string dataType;
        AccessType accessType;
        string reason;
        string[] ipfsHashes;        // Records to access
        uint256 deadline;
        uint256 createdAt;
        uint256 executedAt;
        uint256 requiredSignatures;
        ProposalStatus status;
        mapping(address => bool) hasApproved;
        address[] approvers;
        mapping(address => bool) hasRejected;
        address[] rejectors;
        string rejectionReason;
    }
    
    struct SignatureRequirement {
        uint256 standardAccess;     // Normal record access
        uint256 emergencyAccess;    // Emergency situations
        uint256 researchAccess;     // Research data
        uint256 legalAccess;        // Legal/court orders
        uint256 insuranceAccess;    // Insurance claims
    }
    
    // Mappings
    mapping(bytes32 => Proposal) public proposals;
    mapping(address => bool) public authorizedApprovers;
    mapping(address => string) public approverRoles;
    mapping(address => bytes32[]) public proposerHistory;
    mapping(address => bytes32[]) public approverHistory;
    
    // State variables
    bytes32[] public allProposalIds;
    SignatureRequirement public signatureRequirements;
    address public admin;
    uint256 public defaultDeadline = 24 hours;
    uint256 public emergencyDeadline = 2 hours;
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier onlyAuthorizedApprover() {
        require(authorizedApprovers[msg.sender], "Not authorized to approve proposals");
        _;
    }
    
    modifier proposalExists(bytes32 _proposalId) {
        require(proposals[_proposalId].proposer != address(0), "Proposal does not exist");
        _;
    }
    
    modifier proposalPending(bytes32 _proposalId) {
        require(proposals[_proposalId].status == ProposalStatus.Pending, "Proposal is not pending");
        require(block.timestamp <= proposals[_proposalId].deadline, "Proposal has expired");
        _;
    }
    
    // Constructor
    constructor(address _consentContractAddress) {
        admin = msg.sender;
        consentContract = ConsentManagement(_consentContractAddress);
        
        // Set default signature requirements
        signatureRequirements = SignatureRequirement({
            standardAccess: 3,      // 3 signatures for normal access
            emergencyAccess: 2,     // 2 signatures for emergency
            researchAccess: 4,      // 4 signatures for research
            legalAccess: 2,         // 2 signatures for legal (court orders)
            insuranceAccess: 3      // 3 signatures for insurance
        });
        
        // Admin is automatically an authorized approver
        authorizedApprovers[admin] = true;
        approverRoles[admin] = "Administrator";
    }
    
    /**
     * @dev Add an authorized approver
     */
    function addApprover(address _approver, string memory _role) external onlyAdmin {
        require(_approver != address(0), "Invalid approver address");
        authorizedApprovers[_approver] = true;
        approverRoles[_approver] = _role;
    }
    
    /**
     * @dev Remove an authorized approver
     */
    function removeApprover(address _approver) external onlyAdmin {
        authorizedApprovers[_approver] = false;
        delete approverRoles[_approver];
    }
    
    /**
     * @dev Update signature requirements
     */
    function updateSignatureRequirements(
        uint256 _standard,
        uint256 _emergency,
        uint256 _research,
        uint256 _legal,
        uint256 _insurance
    ) external onlyAdmin {
        signatureRequirements = SignatureRequirement({
            standardAccess: _standard,
            emergencyAccess: _emergency,
            researchAccess: _research,
            legalAccess: _legal,
            insuranceAccess: _insurance
        });
    }
    
    /**
     * @dev Propose access to medical records
     */
    function proposeAction(
        address _patient,
        string memory _dataType,
        AccessType _accessType,
        string memory _reason,
        string[] memory _ipfsHashes
    ) external returns (bytes32 proposalId) {
        require(_patient != address(0), "Invalid patient address");
        require(bytes(_dataType).length > 0, "Data type cannot be empty");
        require(bytes(_reason).length > 0, "Reason cannot be empty");
        
        // Check if proposer has basic consent from patient
        (bool hasConsent,) = consentContract.checkConsent(_patient, msg.sender, _dataType);
        require(hasConsent, "No valid consent from patient");
        
        // Generate unique proposal ID
        proposalId = keccak256(
            abi.encodePacked(
                msg.sender,
                _patient,
                _dataType,
                _reason,
                block.timestamp,
                block.number
            )
        );
        
        // Determine required signatures and deadline based on access type
        uint256 requiredSigs = getRequiredSignatures(_accessType);
        uint256 deadline = _accessType == AccessType.Emergency ? 
            block.timestamp + emergencyDeadline : 
            block.timestamp + defaultDeadline;
        
        // Create proposal
        Proposal storage proposal = proposals[proposalId];
        proposal.proposalId = proposalId;
        proposal.proposer = msg.sender;
        proposal.patient = _patient;
        proposal.dataType = _dataType;
        proposal.accessType = _accessType;
        proposal.reason = _reason;
        proposal.ipfsHashes = _ipfsHashes;
        proposal.deadline = deadline;
        proposal.createdAt = block.timestamp;
        proposal.requiredSignatures = requiredSigs;
        proposal.status = ProposalStatus.Pending;
        
        // Track proposal
        allProposalIds.push(proposalId);
        proposerHistory[msg.sender].push(proposalId);
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            _patient,
            _dataType,
            _reason,
            deadline,
            requiredSigs
        );
        
        return proposalId;
    }
    
    /**
     * @dev Approve a proposal
     */
    function approveAction(bytes32 _proposalId) 
        external 
        onlyAuthorizedApprover 
        proposalExists(_proposalId) 
        proposalPending(_proposalId) 
    {
        Proposal storage proposal = proposals[_proposalId];
        
        require(!proposal.hasApproved[msg.sender], "Already approved this proposal");
        require(msg.sender != proposal.proposer, "Proposer cannot approve own proposal");
        
        // Verify patient consent is still valid
        (bool hasConsent,) = consentContract.checkConsent(
            proposal.patient, 
            proposal.proposer, 
            proposal.dataType
        );
        require(hasConsent, "Patient consent no longer valid");
        
        // Record approval
        proposal.hasApproved[msg.sender] = true;
        proposal.approvers.push(msg.sender);
        approverHistory[msg.sender].push(_proposalId);
        
        uint256 currentApprovals = proposal.approvers.length;
        
        emit ProposalApproved(
            _proposalId,
            msg.sender,
            currentApprovals,
            proposal.requiredSignatures
        );
        
        // Check if enough signatures collected
        if (currentApprovals >= proposal.requiredSignatures) {
            proposal.status = ProposalStatus.Approved;
        }
    }
    
    /**
     * @dev Reject a proposal
     */
    function rejectAction(bytes32 _proposalId, string memory _reason) 
        external 
        onlyAuthorizedApprover 
        proposalExists(_proposalId) 
        proposalPending(_proposalId) 
    {
        Proposal storage proposal = proposals[_proposalId];
        
        require(!proposal.hasRejected[msg.sender], "Already rejected this proposal");
        require(bytes(_reason).length > 0, "Rejection reason required");
        
        proposal.hasRejected[msg.sender] = true;
        proposal.rejectors.push(msg.sender);
        proposal.status = ProposalStatus.Rejected;
        proposal.rejectionReason = _reason;
        
        emit ProposalRejected(_proposalId, msg.sender, _reason);
    }
    
    /**
     * @dev Execute an approved proposal
     */
    function executeAction(bytes32 _proposalId) 
        external 
        proposalExists(_proposalId) 
        returns (bool success) 
    {
        Proposal storage proposal = proposals[_proposalId];
        
        require(
            proposal.status == ProposalStatus.Approved, 
            "Proposal not approved"
        );
        require(
            msg.sender == proposal.proposer || authorizedApprovers[msg.sender],
            "Not authorized to execute"
        );
        require(
            block.timestamp <= proposal.deadline,
            "Proposal has expired"
        );
        
        // Final consent verification
        (bool hasConsent,) = consentContract.checkConsent(
            proposal.patient, 
            proposal.proposer, 
            proposal.dataType
        );
        require(hasConsent, "Patient consent revoked");
        
        // Mark as executed
        proposal.status = ProposalStatus.Executed;
        proposal.executedAt = block.timestamp;
        
        emit ProposalExecuted(_proposalId, msg.sender, true, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Mark expired proposals
     */
    function markExpired(bytes32 _proposalId) external proposalExists(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp > proposal.deadline, "Proposal not yet expired");
        require(proposal.status == ProposalStatus.Pending, "Proposal not pending");
        
        proposal.status = ProposalStatus.Expired;
        
        emit ProposalExpired(_proposalId, block.timestamp);
    }
    
    /**
     * @dev Get required signatures for access type
     */
    function getRequiredSignatures(AccessType _accessType) public view returns (uint256) {
        if (_accessType == AccessType.Emergency) {
            return signatureRequirements.emergencyAccess;
        } else if (_accessType == AccessType.Research) {
            return signatureRequirements.researchAccess;
        } else if (_accessType == AccessType.Legal) {
            return signatureRequirements.legalAccess;
        } else if (_accessType == AccessType.Insurance) {
            return signatureRequirements.insuranceAccess;
        } else {
            return signatureRequirements.standardAccess;
        }
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposalDetails(bytes32 _proposalId) external view returns (
        address proposer,
        address patient,
        string memory dataType,
        AccessType accessType,
        string memory reason,
        uint256 deadline,
        uint256 createdAt,
        uint256 requiredSignatures,
        uint256 currentApprovals,
        ProposalStatus status
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.patient,
            proposal.dataType,
            proposal.accessType,
            proposal.reason,
            proposal.deadline,
            proposal.createdAt,
            proposal.requiredSignatures,
            proposal.approvers.length,
            proposal.status
        );
    }
    
    /**
     * @dev Get proposal approvers
     */
    function getProposalApprovers(bytes32 _proposalId) external view returns (address[] memory) {
        return proposals[_proposalId].approvers;
    }
    
    /**
     * @dev Get proposal IPFS hashes
     */
    function getProposalIPFSHashes(bytes32 _proposalId) external view returns (string[] memory) {
        return proposals[_proposalId].ipfsHashes;
    }
    
    /**
     * @dev Get all proposals by status
     */
    function getProposalsByStatus(ProposalStatus _status) external view returns (bytes32[] memory) {
        bytes32[] memory result = new bytes32[](allProposalIds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allProposalIds.length; i++) {
            if (proposals[allProposalIds[i]].status == _status) {
                result[count] = allProposalIds[i];
                count++;
            }
        }
        
        // Resize array to actual count
        bytes32[] memory finalResult = new bytes32[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
    
    /**
     * @dev Get proposals by proposer
     */
    function getProposalsByProposer(address _proposer) external view returns (bytes32[] memory) {
        return proposerHistory[_proposer];
    }
    
    /**
     * @dev Get proposals approved by an approver
     */
    function getProposalsByApprover(address _approver) external view returns (bytes32[] memory) {
        return approverHistory[_approver];
    }
    
    /**
     * @dev Check if proposal has been approved by specific address
     */
    function hasApproved(bytes32 _proposalId, address _approver) external view returns (bool) {
        return proposals[_proposalId].hasApproved[_approver];
    }
    
    /**
     * @dev Get total number of proposals
     */
    function getTotalProposals() external view returns (uint256) {
        return allProposalIds.length;
    }
    
    /**
     * @dev Get signature requirements
     */
    function getSignatureRequirements() external view returns (
        uint256 standard,
        uint256 emergency,
        uint256 research,
        uint256 legal,
        uint256 insurance
    ) {
        return (
            signatureRequirements.standardAccess,
            signatureRequirements.emergencyAccess,
            signatureRequirements.researchAccess,
            signatureRequirements.legalAccess,
            signatureRequirements.insuranceAccess
        );
    }
    
    /**
     * @dev Check if proposal is executed (helper for other contracts)
     */
    function isProposalExecuted(bytes32 _proposalId) external view returns (bool) {
        return proposals[_proposalId].status == ProposalStatus.Executed;
    }
    
    /**
     * @dev Emergency function to update consent contract address
     */
    function updateConsentContract(address _newConsentContract) external onlyAdmin {
        require(_newConsentContract != address(0), "Invalid contract address");
        consentContract = ConsentManagement(_newConsentContract);
    }
}