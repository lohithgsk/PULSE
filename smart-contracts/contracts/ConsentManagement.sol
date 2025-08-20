// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ConsentManagement
 * @dev Smart contract for managing patient consent for medical record access
 * @author ARCHBTW Team - MedLedger
 */
contract ConsentManagement {
    
    // Events
    event ConsentGranted(
        address indexed patient,
        address indexed accessor,
        string dataType,
        uint256 expiryTimestamp,
        bytes32 txHash
    );
    
    event ConsentRevoked(
        address indexed patient,
        address indexed accessor,
        string dataType,
        bytes32 txHash
    );
    
    event ConsentChecked(
        address indexed patient,
        address indexed accessor,
        string dataType,
        bool granted,
        uint256 timestamp
    );
    
    // Structs
    struct Consent {
        bool isActive;
        uint256 grantedAt;
        uint256 expiryTimestamp;
        string dataType;
        bytes32 consentHash;
    }
    
    // Mappings
    mapping(address => mapping(address => mapping(string => Consent))) private consents;
    mapping(address => address[]) private patientAccessors;
    mapping(address => mapping(address => bool)) private hasAccessorBeenAdded;
    mapping(address => mapping(address => string[])) private grantedDataTypes;
    mapping(address => mapping(address => mapping(string => bool))) private dataTypeExists;
    
    // Modifiers
    modifier onlyPatient() {
        require(msg.sender != address(0), "Invalid patient address");
        _;
    }
    
    modifier validAccessor(address _accessor) {
        require(_accessor != address(0), "Invalid accessor address");
        require(_accessor != msg.sender, "Cannot grant consent to yourself");
        _;
    }
    
    modifier validDataType(string memory _dataType) {
        require(bytes(_dataType).length > 0, "Data type cannot be empty");
        _;
    }
    
    /**
     * @dev Grant consent for a specific data type to an accessor
     */
    function grantConsent(
        address _accessor,
        string memory _dataType,
        uint256 _expiry
    ) 
        external 
        onlyPatient 
        validAccessor(_accessor) 
        validDataType(_dataType)
    {
        if (_expiry != 0) {
            require(_expiry > block.timestamp, "Expiry must be in the future");
        }
        
        bytes32 consentHash = keccak256(
            abi.encodePacked(
                msg.sender,
                _accessor,
                _dataType,
                block.timestamp,
                _expiry
            )
        );
        
        consents[msg.sender][_accessor][_dataType] = Consent({
            isActive: true,
            grantedAt: block.timestamp,
            expiryTimestamp: _expiry,
            dataType: _dataType,
            consentHash: consentHash
        });
        
        if (!hasAccessorBeenAdded[msg.sender][_accessor]) {
            patientAccessors[msg.sender].push(_accessor);
            hasAccessorBeenAdded[msg.sender][_accessor] = true;
        }
        
        if (!dataTypeExists[msg.sender][_accessor][_dataType]) {
            grantedDataTypes[msg.sender][_accessor].push(_dataType);
            dataTypeExists[msg.sender][_accessor][_dataType] = true;
        }
        
        emit ConsentGranted(
            msg.sender,
            _accessor,
            _dataType,
            _expiry,
            consentHash
        );
    }
    
    /**
     * @dev Revoke consent for a specific data type from an accessor
     */
    function revokeConsent(
        address _accessor,
        string memory _dataType
    ) 
        external 
        onlyPatient 
        validAccessor(_accessor) 
        validDataType(_dataType)
    {
        require(
            consents[msg.sender][_accessor][_dataType].isActive,
            "No active consent found"
        );
        
        bytes32 consentHash = consents[msg.sender][_accessor][_dataType].consentHash;
        consents[msg.sender][_accessor][_dataType].isActive = false;
        
        emit ConsentRevoked(
            msg.sender,
            _accessor,
            _dataType,
            consentHash
        );
    }
    
    /**
     * @dev Check if an accessor has valid consent for a specific data type
     * This function can modify state (auto-revoke expired consents) and emits events
     */
    function checkConsent(
        address _patient,
        address _accessor,
        string memory _dataType
    ) 
        external 
        returns (bool granted, uint256 expiry)
    {
        require(_patient != address(0), "Invalid patient address");
        require(_accessor != address(0), "Invalid accessor address");
        require(bytes(_dataType).length > 0, "Invalid data type");
        
        Consent memory consent = consents[_patient][_accessor][_dataType];
        
        if (!consent.isActive) {
            emit ConsentChecked(_patient, _accessor, _dataType, false, block.timestamp);
            return (false, 0);
        }
        
        if (consent.expiryTimestamp != 0 && consent.expiryTimestamp <= block.timestamp) {
            consents[_patient][_accessor][_dataType].isActive = false;
            emit ConsentChecked(_patient, _accessor, _dataType, false, block.timestamp);
            return (false, 0);
        }
        
        emit ConsentChecked(_patient, _accessor, _dataType, true, block.timestamp);
        return (true, consent.expiryTimestamp);
    }
    
    /**
     * @dev Check consent without modifying state (view function for other contracts)
     * This function does NOT auto-revoke expired consents and does NOT emit events
     */
    function checkConsentView(
        address _patient,
        address _accessor,
        string memory _dataType
    ) 
        external 
        view
        returns (bool granted, uint256 expiry)
    {
        require(_patient != address(0), "Invalid patient address");
        require(_accessor != address(0), "Invalid accessor address");
        require(bytes(_dataType).length > 0, "Invalid data type");
        
        Consent memory consent = consents[_patient][_accessor][_dataType];
        
        if (!consent.isActive) {
            return (false, 0);
        }
        
        if (consent.expiryTimestamp != 0 && consent.expiryTimestamp <= block.timestamp) {
            return (false, 0);
        }
        
        return (true, consent.expiryTimestamp);
    }
    
    /**
     * @dev Get all accessors for a patient
     */
    function getPatientAccessors(address _patient) 
        external 
        view 
        returns (address[] memory) 
    {
        require(_patient != address(0), "Invalid patient address");
        return patientAccessors[_patient];
    }
    
    /**
     * @dev Get all data types granted to an accessor by a patient
     */
    function getGrantedDataTypes(address _patient, address _accessor) 
        external 
        view 
        returns (string[] memory) 
    {
        require(_patient != address(0), "Invalid patient address");
        require(_accessor != address(0), "Invalid accessor address");
        return grantedDataTypes[_patient][_accessor];
    }
    
    /**
     * @dev Get detailed consent information
     */
    function getConsentDetails(
        address _patient,
        address _accessor,
        string memory _dataType
    ) 
        external 
        view 
        returns (
            bool isActive,
            uint256 grantedAt,
            uint256 expiryTimestamp,
            bytes32 consentHash
        ) 
    {
        require(_patient != address(0), "Invalid patient address");
        require(_accessor != address(0), "Invalid accessor address");
        require(bytes(_dataType).length > 0, "Invalid data type");
        
        Consent memory consent = consents[_patient][_accessor][_dataType];
        
        return (
            consent.isActive,
            consent.grantedAt,
            consent.expiryTimestamp,
            consent.consentHash
        );
    }
    
    /**
     * @dev Revoke all consents granted by a patient
     */
    function revokeAllConsents() external onlyPatient {
        address[] memory accessors = patientAccessors[msg.sender];
        
        for (uint i = 0; i < accessors.length; i++) {
            string[] memory dataTypes = grantedDataTypes[msg.sender][accessors[i]];
            
            for (uint j = 0; j < dataTypes.length; j++) {
                if (consents[msg.sender][accessors[i]][dataTypes[j]].isActive) {
                    consents[msg.sender][accessors[i]][dataTypes[j]].isActive = false;
                    
                    emit ConsentRevoked(
                        msg.sender,
                        accessors[i],
                        dataTypes[j],
                        consents[msg.sender][accessors[i]][dataTypes[j]].consentHash
                    );
                }
            }
        }
    }
    
    /**
     * @dev Get the total number of active consents for a patient
     */
    function getActiveConsentCount(address _patient) 
        external 
        view 
        returns (uint256 count) 
    {
        require(_patient != address(0), "Invalid patient address");
        
        address[] memory accessors = patientAccessors[_patient];
        
        for (uint i = 0; i < accessors.length; i++) {
            string[] memory dataTypes = grantedDataTypes[_patient][accessors[i]];
            
            for (uint j = 0; j < dataTypes.length; j++) {
                Consent memory consent = consents[_patient][accessors[i]][dataTypes[j]];
                
                if (consent.isActive && 
                    (consent.expiryTimestamp == 0 || consent.expiryTimestamp > block.timestamp)) {
                    count++;
                }
            }
        }
        
        return count;
    }
}