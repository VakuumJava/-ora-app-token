// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title QoraNFT
 * @dev NFT contract for Qora collectible cards
 * Network: Ethereum Mainnet
 * Max Supply: 2000
 */
contract QoraNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant MAX_SUPPLY = 2000;
    
    // Mapping from token ID to card properties
    mapping(uint256 => CardProperties) public cardProperties;
    
    // Mapping from user address to their minted tokens
    mapping(address => uint256[]) public userTokens;
    
    struct CardProperties {
        string model;
        string background;
        uint256 mintedAt;
        address originalMinter;
    }
    
    event CardMinted(
        uint256 indexed tokenId,
        address indexed to,
        string model,
        string background
    );
    
    event CardTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    constructor() ERC721("Qora Card", "QORA") Ownable(msg.sender) {}

    /**
     * @dev Mints a new Qora NFT card
     * @param to Address to mint the NFT to
     * @param model The model type of the card
     * @param background The background type of the card
     * @param tokenURI The metadata URI for the token
     */
    function mintCard(
        address to,
        string memory model,
        string memory background,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        cardProperties[tokenId] = CardProperties({
            model: model,
            background: background,
            mintedAt: block.timestamp,
            originalMinter: to
        });
        
        userTokens[to].push(tokenId);
        
        emit CardMinted(tokenId, to, model, background);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs
     * @param recipients Array of addresses to mint to
     * @param models Array of model types
     * @param backgrounds Array of background types
     * @param tokenURIs Array of metadata URIs
     */
    function batchMint(
        address[] memory recipients,
        string[] memory models,
        string[] memory backgrounds,
        string[] memory tokenURIs
    ) public onlyOwner {
        require(
            recipients.length == models.length &&
            models.length == backgrounds.length &&
            backgrounds.length == tokenURIs.length,
            "Arrays length mismatch"
        );
        
        require(
            _tokenIdCounter.current() + recipients.length <= MAX_SUPPLY,
            "Batch would exceed max supply"
        );
        
        for (uint256 i = 0; i < recipients.length; i++) {
            mintCard(recipients[i], models[i], backgrounds[i], tokenURIs[i]);
        }
    }

    /**
     * @dev Get all token IDs owned by an address
     * @param owner The address to query
     */
    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
            }
        }
        
        return tokens;
    }
    
    /**
     * @dev Get card properties for a token
     * @param tokenId The token ID to query
     */
    function getCardProperties(uint256 tokenId) public view returns (
        string memory model,
        string memory background,
        uint256 mintedAt,
        address originalMinter
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        CardProperties memory props = cardProperties[tokenId];
        return (props.model, props.background, props.mintedAt, props.originalMinter);
    }
    
    /**
     * @dev Get total minted count
     */
    function totalMinted() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Check if max supply is reached
     */
    function isMaxSupplyReached() public view returns (bool) {
        return _tokenIdCounter.current() >= MAX_SUPPLY;
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Override transfer to emit custom event and update userTokens
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        if (from != address(0) && to != address(0)) {
            emit CardTransferred(tokenId, from, to);
            
            // Update userTokens mapping
            if (from != to) {
                // Remove from old owner
                uint256[] storage fromTokens = userTokens[from];
                for (uint256 i = 0; i < fromTokens.length; i++) {
                    if (fromTokens[i] == tokenId) {
                        fromTokens[i] = fromTokens[fromTokens.length - 1];
                        fromTokens.pop();
                        break;
                    }
                }
                
                // Add to new owner
                userTokens[to].push(tokenId);
            }
        }
        
        return super._update(to, tokenId, auth);
    }
}
