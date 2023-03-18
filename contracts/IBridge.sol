//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IBridge {
  function sendMessage(
    address _target,
    bytes memory _message,
    uint32 _gasLimit
  ) external;

  function xDomainMessageSender() external returns (address);
}
