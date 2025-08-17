// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ConsentManagement.sol";
import "./MultiSignatureAccess.sol";

/**
 * @title RecordRegistry
 * @dev Smart contract for managing medical records with IPFS storage
 * @author ARCHBTW Team - MedLedger
 */
contract RecordRegistry {
    
    // Reference to other contracts
    ConsentManagement public consentContract;
    MultiSignatureAccess public multiSigContract;
    
    // Events
    event RecordRegistered(
        bytes32 indexed recordId,
        address indexed patient,
        address indexed provider,
        string dataType,
        string ipfsHash,
        uint256 timestamp,
        bool encrypted
    );
    
    event RecordAccessed(
        bytes32 indexed recordId,
        address indexed accessor,
        address indexed patient,
        string accessReason,
        uint256 timestamp,
        bytes32 multiSigProposalId
    );
    
    event RecordUpdated(
        bytes32 indexed recordId,
        address indexed updater,
        string newIpfsHash,
        string updateReason,
        uint256 version,
        uint256 timestamp
    );
    
    event RecordDeleted(
        bytes32 indexed recordId,
        address indexed deleter,
        string deleteReason,
        uint256 timestamp
    );
    
    event RecordShared(
        bytes32 indexed recordId,
        address indexed patient,
        address indexed sharedWith,
        uint256 shareExpiry,
        string shareReason
    );
    
    event RecordVersionCreated(
        bytes32 indexed originalRecordId,
        bytes32 indexed newVersionId,
        uint256 versionNumber,
        address indexed creator
    );
    
    // Enums
    enum RecordStatus {
        Active,
        Archived,
        Deleted,
        Quarantined
    }
    
    enum RecordType {
        Diagnosis,
        Prescription,
        LabResult,
        Imaging,
        Surgery,
        Emergency,
        Vaccination,
        Allergy,
        VitalSigns,
        Discharge,
        Consultation,
        Other
    }
    
    // Structs
    struct MedicalRecord {
        bytes32 recordId;
        address patient;
        address provider;
        string dataType;
        RecordType recordType;
        string ipfsHash;
        string encryptionKey;      // For encrypted records
        string metadata;           // JSON metadata
        uint256 createdAt;
        uint256 lastModified;
        uint256 version;
        RecordStatus status;
        bool isEncrypted;
        bool isEmergencyAccessible;
        bytes32[] previousVersions;
        mapping(address => bool) authorizedViewers;
        address[] viewersList;
    }
    
    struct RecordAccess {
        address accessor;
        uint256 accessTime;
        string reason;
        bytes32 multiSigProposalId;
        bool wasEmergencyAccess;
    }
    
    struct RecordShare {
        address sharedWith;
        uint256 sharedAt;
        uint256 expiresAt;
        string reason;
        bool isActive;
    }
    
    // Mappings
    mapping(bytes32 => MedicalRecord) public records;
    mapping(address => bytes32[]) public patientRecords;
    mapping(address => bytes32[]) public providerRecords;
    mapping(string => bytes32[]) public recordsByType;
    mapping(bytes32 => RecordAccess[]) public recordAccessHistory;
    mapping(bytes32 => RecordShare[]) public recordShares;
    mapping(string => bytes32) public ipfsHashToRecordId;
    
    // State variables
    bytes32[] public allRecordIds;
    mapping(address => bool) public authorizedProviders;
    mapping(address => string) public providerNames;
    address public admin;
    uint256 public totalRecords;
    uint256 public emergencyAccessWindow = 24 hours;
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Not authorized provider");
        _;
    }
    
    modifier onlyPatientOrProvider(bytes32 _recordId) {
        MedicalRecord storage record = records[_recordId];
        require(
            msg.sender == record.patient || msg.sender == record.provider,
            "Not authorized to access this record"
        );
        _;
    }
    
    modifier recordExists(bytes32 _recordId) {
        require(records[_recordId].patient != address(0), "Record does not exist");
        _;
    }
    
    modifier recordActive(bytes32 _recordId) {
        require(records[_recordId].status == RecordStatus.Active, "Record is not active");
        _;
    }
    
    // Constructor
    constructor(
        address _consentContractAddress,
        address _multiSigContractAddress
    ) {
        admin = msg.sender;
        consentContract = ConsentManagement(_consentContractAddress);
        multiSigContract = MultiSignatureAccess(_multiSigContractAddress);
        
        // Admin is automatically authorized provider
        authorizedProviders[admin] = true;
        providerNames[admin] = "System Administrator";
    }
    
    /**
     * @dev Add authorized medical provider
     */
    function addProvider(address _provider, string memory _name) external onlyAdmin {
        require(_provider != address(0), "Invalid provider address");
        authorizedProviders[_provider] = true;
        providerNames[_provider] = _name;
    }
    
    /**
     * @dev Remove authorized medical provider
     */
    function removeProvider(address _provider) external onlyAdmin {
        authorizedProviders[_provider] = false;
        delete providerNames[_provider];
    }
    
    /**
     * @dev Register a new medical record
     */
    function registerRecord(
        address _patient,
        string memory _dataType,
        RecordType _recordType,
        string memory _ipfsHash,
        string memory _metadata,
        bool _isEncrypted,
        string memory _encryptionKey,
        bool _isEmergencyAccessible
    ) external onlyAuthorizedProvider returns (bytes32 recordId) {
        require(_patient != address(0), "Invalid patient address");
        require(bytes(_dataType).length > 0, "Data type cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(ipfsHashToRecordId[_ipfsHash] == bytes32(0), "IPFS hash already registered");
        
        // Generate unique record ID
        recordId = keccak256(
            abi.encodePacked(
                _patient,
                msg.sender,
                _dataType,
                _ipfsHash,
                block.timestamp,
                block.number
            )
        );
        
        // Create medical record
        MedicalRecord storage record = records[recordId];
        record.recordId = recordId;
        record.patient = _patient;
        record.provider = msg.sender;
        record.dataType = _dataType;
        record.recordType = _recordType;
        record.ipfsHash = _ipfsHash;
        record.encryptionKey = _encryptionKey;
        record.metadata = _metadata;
        record.createdAt = block.timestamp;
        record.lastModified = block.timestamp;
        record.version = 1;
        record.status = RecordStatus.Active;
        record.isEncrypted = _isEncrypted;
        record.isEmergencyAccessible = _isEmergencyAccessible;
        
        // Track record
        allRecordIds.push(recordId);
        patientRecords[_patient].push(recordId);
        providerRecords[msg.sender].push(recordId);
        recordsByType[_dataType].push(recordId);
        ipfsHashToRecordId[_ipfsHash] = recordId;
        totalRecords++;
        
        emit RecordRegistered(
            recordId,
            _patient,
            msg.sender,
            _dataType,
            _ipfsHash,
            block.timestamp,
            _isEncrypted
        );
        
        return recordId;
    }
    
    /**
     * @dev Access a medical record with proper authorization
     */
    function accessRecord(
        bytes32 _recordId,
        string memory _reason,
        bytes32 _multiSigProposalId
    ) external recordExists(_recordId) recordActive(_recordId) returns (string memory ipfsHash, string memory encryptionKey) {
        MedicalRecord storage record = records[_recordId];
        
        bool isAuthorized = false;
        bool isEmergencyAccess = false;
        
        // Check authorization methods in order of preference
        
        // 1. Patient can always access their own records
        if (msg.sender == record.patient) {
            isAuthorized = true;
        }
        // 2. Provider who created the record can access
        else if (msg.sender == record.provider) {
            isAuthorized = true;
        }
        // 3. Check if accessor has patient consent
        else {
            (bool hasConsent,) = consentContract.checkConsentView(
                record.patient,
                msg.sender,
                record.dataType
            );
            if (hasConsent) {
                isAuthorized = true;
            }
        }
        
        // 4. Check multi-signature authorization (if provided)
        if (!isAuthorized && _multiSigProposalId != bytes32(0)) {
            // Check if the multi-sig proposal was executed successfully
            bool isExecuted = multiSigContract.isProposalExecuted(_multiSigProposalId);
            if (isExecuted) {
                isAuthorized = true;
            }
        }
        
        // 5. Emergency access for critical records
        if (!isAuthorized && record.isEmergencyAccessible) {
            // Allow emergency access for authorized providers within emergency window
            if (authorizedProviders[msg.sender] && 
                block.timestamp <= record.createdAt + emergencyAccessWindow) {
                isAuthorized = true;
                isEmergencyAccess = true;
            }
        }
        
        require(isAuthorized, "Not authorized to access this record");
        
        // For non-patient/provider access, do a final consent verification with state modification
        if (msg.sender != record.patient && msg.sender != record.provider) {
            (bool hasValidConsent,) = consentContract.checkConsent(
                record.patient,
                msg.sender,
                record.dataType
            );
            require(hasValidConsent, "Patient consent no longer valid");
        }
        
        // Log access
        recordAccessHistory[_recordId].push(RecordAccess({
            accessor: msg.sender,
            accessTime: block.timestamp,
            reason: _reason,
            multiSigProposalId: _multiSigProposalId,
            wasEmergencyAccess: isEmergencyAccess
        }));
        
        emit RecordAccessed(
            _recordId,
            msg.sender,
            record.patient,
            _reason,
            block.timestamp,
            _multiSigProposalId
        );
        
        return (record.ipfsHash, record.encryptionKey);
    }
    
    /**
     * @dev Update an existing medical record (creates new version)
     */
    function updateRecord(
        bytes32 _recordId,
        string memory _newIpfsHash,
        string memory _updateReason,
        string memory _newMetadata,
        string memory _newEncryptionKey
    ) external recordExists(_recordId) recordActive(_recordId) onlyPatientOrProvider(_recordId) {
        require(bytes(_newIpfsHash).length > 0, "New IPFS hash cannot be empty");
        require(bytes(_updateReason).length > 0, "Update reason required");
        require(ipfsHashToRecordId[_newIpfsHash] == bytes32(0), "IPFS hash already registered");
        
        MedicalRecord storage record = records[_recordId];
        
        // Store previous version
        record.previousVersions.push(keccak256(abi.encodePacked(record.ipfsHash, record.version)));
        
        // Update record
        record.ipfsHash = _newIpfsHash;
        record.lastModified = block.timestamp;
        record.version++;
        if (bytes(_newMetadata).length > 0) {
            record.metadata = _newMetadata;
        }
        if (bytes(_newEncryptionKey).length > 0) {
            record.encryptionKey = _newEncryptionKey;
        }
        
        // Update IPFS mapping
        ipfsHashToRecordId[_newIpfsHash] = _recordId;
        
        emit RecordUpdated(
            _recordId,
            msg.sender,
            _newIpfsHash,
            _updateReason,
            record.version,
            block.timestamp
        );
    }
    
    /**
     * @dev Delete a medical record (soft delete)
     */
    function deleteRecord(
        bytes32 _recordId,
        string memory _deleteReason
    ) external recordExists(_recordId) onlyPatientOrProvider(_recordId) {
        require(bytes(_deleteReason).length > 0, "Delete reason required");
        
        MedicalRecord storage record = records[_recordId];
        record.status = RecordStatus.Deleted;
        record.lastModified = block.timestamp;
        
        emit RecordDeleted(_recordId, msg.sender, _deleteReason, block.timestamp);
    }
    
    /**
     * @dev Share record with specific address for limited time
     */
    function shareRecord(
        bytes32 _recordId,
        address _sharedWith,
        uint256 _expiryDuration,
        string memory _shareReason
    ) external recordExists(_recordId) recordActive(_recordId) {
        require(_sharedWith != address(0), "Invalid address to share with");
        require(msg.sender == records[_recordId].patient, "Only patient can share records");
        require(_expiryDuration > 0, "Invalid expiry duration");
        
        uint256 expiresAt = block.timestamp + _expiryDuration;
        
        recordShares[_recordId].push(RecordShare({
            sharedWith: _sharedWith,
            sharedAt: block.timestamp,
            expiresAt: expiresAt,
            reason: _shareReason,
            isActive: true
        }));
        
        // Add to authorized viewers
        if (!records[_recordId].authorizedViewers[_sharedWith]) {
            records[_recordId].authorizedViewers[_sharedWith] = true;
            records[_recordId].viewersList.push(_sharedWith);
        }
        
        emit RecordShared(_recordId, msg.sender, _sharedWith, expiresAt, _shareReason);
    }
    
    /**
     * @dev Get patient's records by type
     */
    function getPatientRecords(
        address _patient,
        string memory _dataType
    ) external view returns (bytes32[] memory) {
        bytes32[] memory patientRecordIds = patientRecords[_patient];
        bytes32[] memory filteredRecords = new bytes32[](patientRecordIds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < patientRecordIds.length; i++) {
            MedicalRecord storage record = records[patientRecordIds[i]];
            if (
                (bytes(_dataType).length == 0 || 
                 keccak256(bytes(record.dataType)) == keccak256(bytes(_dataType))) &&
                record.status == RecordStatus.Active
            ) {
                filteredRecords[count] = patientRecordIds[i];
                count++;
            }
        }
        
        // Resize array
        bytes32[] memory result = new bytes32[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = filteredRecords[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get record details
     */
    function getRecordDetails(bytes32 _recordId) external view recordExists(_recordId) returns (
        address patient,
        address provider,
        string memory dataType,
        RecordType recordType,
        string memory metadata,
        uint256 createdAt,
        uint256 lastModified,
        uint256 version,
        RecordStatus status,
        bool isEncrypted,
        bool isEmergencyAccessible
    ) {
        MedicalRecord storage record = records[_recordId];
        return (
            record.patient,
            record.provider,
            record.dataType,
            record.recordType,
            record.metadata,
            record.createdAt,
            record.lastModified,
            record.version,
            record.status,
            record.isEncrypted,
            record.isEmergencyAccessible
        );
    }
    
    /**
     * @dev Get record access history
     */
    function getRecordAccessHistory(bytes32 _recordId) external view recordExists(_recordId) returns (
        address[] memory accessors,
        uint256[] memory accessTimes,
        string[] memory reasons
    ) {
        RecordAccess[] storage accesses = recordAccessHistory[_recordId];
        uint256 length = accesses.length;
        
        address[] memory accessorsList = new address[](length);
        uint256[] memory timesList = new uint256[](length);
        string[] memory reasonsList = new string[](length);
        
        for (uint256 i = 0; i < length; i++) {
            accessorsList[i] = accesses[i].accessor;
            timesList[i] = accesses[i].accessTime;
            reasonsList[i] = accesses[i].reason;
        }
        
        return (accessorsList, timesList, reasonsList);
    }
    
    /**
     * @dev Get records by IPFS hash
     */
    function getRecordByIPFSHash(string memory _ipfsHash) external view returns (bytes32 recordId) {
        return ipfsHashToRecordId[_ipfsHash];
    }
    
    /**
     * @dev Get records by status
     */
    function getRecordsByStatus(RecordStatus _status) external view returns (bytes32[] memory) {
        bytes32[] memory result = new bytes32[](allRecordIds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allRecordIds.length; i++) {
            if (records[allRecordIds[i]].status == _status) {
                result[count] = allRecordIds[i];
                count++;
            }
        }
        
        // Resize array
        bytes32[] memory finalResult = new bytes32[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
    
    /**
     * @dev Get record shares
     */
    function getRecordShares(bytes32 _recordId) external view recordExists(_recordId) returns (
        address[] memory sharedWith,
        uint256[] memory sharedAt,
        uint256[] memory expiresAt,
        bool[] memory isActive
    ) {
        RecordShare[] storage shares = recordShares[_recordId];
        uint256 length = shares.length;
        
        address[] memory sharedWithList = new address[](length);
        uint256[] memory sharedAtList = new uint256[](length);
        uint256[] memory expiresAtList = new uint256[](length);
        bool[] memory isActiveList = new bool[](length);
        
        for (uint256 i = 0; i < length; i++) {
            sharedWithList[i] = shares[i].sharedWith;
            sharedAtList[i] = shares[i].sharedAt;
            expiresAtList[i] = shares[i].expiresAt;
            isActiveList[i] = shares[i].isActive && shares[i].expiresAt > block.timestamp;
        }
        
        return (sharedWithList, sharedAtList, expiresAtList, isActiveList);
    }
    
    /**
     * @dev Get total records count
     */
    function getTotalRecords() external view returns (uint256) {
        return totalRecords;
    }
    
    /**
     * @dev Check if address is authorized to view record
     */
    function isAuthorizedToView(bytes32 _recordId, address _viewer) external view recordExists(_recordId) returns (bool) {
        MedicalRecord storage record = records[_recordId];
        
        // Patient can always view their records
        if (_viewer == record.patient) return true;
        
        // Provider who created record can view
        if (_viewer == record.provider) return true;
        
        // Check if explicitly authorized
        if (record.authorizedViewers[_viewer]) return true;
        
        // Check patient consent
        (bool hasConsent,) = consentContract.checkConsentView(record.patient, _viewer, record.dataType);
        if (hasConsent) return true;
        
        return false;
    }
    
    /**
     * @dev Emergency function to update contract references
     */
    function updateContractReferences(
        address _newConsentContract,
        address _newMultiSigContract
    ) external onlyAdmin {
        if (_newConsentContract != address(0)) {
            consentContract = ConsentManagement(_newConsentContract);
        }
        if (_newMultiSigContract != address(0)) {
            multiSigContract = MultiSignatureAccess(_newMultiSigContract);
        }
    }
    
    /**
     * @dev Set emergency access window
     */
    function setEmergencyAccessWindow(uint256 _windowInSeconds) external onlyAdmin {
        emergencyAccessWindow = _windowInSeconds;
    }
}