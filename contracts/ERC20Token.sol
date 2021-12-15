//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IERC20.sol";

/**
 * @title A contract to demonstrate ERC20 standart
 * @author Me
 */
contract ERC20Token is IERC20 {
    /// The total supply of the contract.
    uint256 private _totalSupply;

    /// A mapping for storing allowance.
    mapping(address => mapping(address => uint256))
        private _ownerSpenderAllowance;

    /// A mapping for storing address balances.
    mapping(address => uint256) private _addressBalance;

    /// @dev See {IERC20-totalSupply}.
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    /// @dev See {IERC20-balanceOf}.
    function balanceOf(address account)
        external
        view
        override
        returns (uint256)
    {
        return _addressBalance[account];
    }

    /// @dev See {IERC20-transfer}.
    function transfer(address recipient, uint256 amount)
        external
        override
        returns (bool)
    {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    /// @dev See {IERC20-allowance}.
    function allowance(address owner, address spender)
        external
        view
        override
        returns (uint256)
    {
        return _ownerSpenderAllowance[owner][spender];
    }

    /// @dev See {IERC20-approve}.
    function approve(address spender, uint256 amount)
        external
        override
        returns (bool)
    {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /// @dev See {IERC20-transferFrom}.
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        require(sender != address(0), "Sender address cannot be 0");
        require(msg.sender != address(0), "Spender address cannot be 0");
        uint256 spenderAllowance = _ownerSpenderAllowance[sender][msg.sender];
        require(spenderAllowance >= amount, "Amount exceeds allowance");

        _approve(sender, msg.sender, spenderAllowance - amount);
        _transfer(sender, recipient, amount);

        return true;
    }

    /**
     * @dev Mints given amount of token for the account.
     * @param account account that tokens are created for.
     * @param amount amount to mint.
     */
    function mint(address account, uint256 amount) external {
        require(account != address(0), "Account address cannot be 0");

        _totalSupply += amount;
        _addressBalance[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Burns given amount of token for the account.
     * @param account account that tokens are destroyed for.
     * @param amount amount to burn.
     */
    function burn(address account, uint256 amount) external {
        require(account != address(0), "Account address cannot be 0");
        uint256 balance = _addressBalance[account];
        require(balance >= amount, "Amount exceeds account balance");

        _totalSupply -= amount;
        _addressBalance[account] -= amount;
        emit Transfer(account, address(0), amount);
    }

    /**
     * @dev Transfers amount of tokens from sender to recipient.
     * @param sender sender of tokens.
     * @param recipient tokens recipient address.
     * @param amount amount to send to recipient.
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) private {
        require(sender != address(0), "Sender address cannot be 0");
        require(recipient != address(0), "Recipient address cannot be 0");
        require(
            _addressBalance[sender] >= amount,
            "Amount exceeds the sender's balance"
        );

        _addressBalance[sender] -= amount;
        _addressBalance[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    /**
     * @dev Sets the amount of tokens that owner allows to be used by spender.
     * @param owner owner of tokens.
     * @param spender spender of tokens.
     * @param amount allowed amount to spend by spender.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) private {
        require(owner != address(0), "Owner address cannot be 0");
        require(spender != address(0), "Spender address cannot be 0");

        _ownerSpenderAllowance[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /// @dev See {IERC20-decimals}.
    function decimals() external pure override returns (uint8) {
        return 18;
    }
}
