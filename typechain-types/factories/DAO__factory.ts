/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DAO, DAOInterface } from "../DAO";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "votingId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum DAO.VoteOption",
        name: "option",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voteAmount",
        type: "uint256",
      },
    ],
    name: "Vote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "votingId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "enum DAO.VotingType",
        name: "votingType",
        type: "uint8",
      },
    ],
    name: "VotingCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "votingId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalVoted",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum DAO.VotingResult",
        name: "result",
        type: "uint8",
      },
    ],
    name: "VotingFinished",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "callData",
        type: "bytes",
      },
    ],
    name: "createVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "createVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegateAddress",
        type: "address",
      },
    ],
    name: "delegateVotesTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ercContract",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "votingId",
        type: "uint256",
      },
    ],
    name: "finishVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "votingId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "voterAddress",
        type: "address",
      },
    ],
    name: "getAddressVote",
    outputs: [
      {
        internalType: "enum DAO.VoteOption",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "votingId",
        type: "uint256",
      },
    ],
    name: "getVotingDetail",
    outputs: [
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSupplyAtCreation",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalFor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAgainst",
        type: "uint256",
      },
      {
        internalType: "enum DAO.VotingResult",
        name: "result",
        type: "uint8",
      },
      {
        internalType: "enum DAO.VotingType",
        name: "votingType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "callData",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minimumQuorumPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ercContract",
        type: "address",
      },
    ],
    name: "setErcContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "votingId",
        type: "uint256",
      },
      {
        internalType: "enum DAO.VoteOption",
        name: "option",
        type: "uint8",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "votingId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "votingAddress",
        type: "address",
      },
      {
        internalType: "enum DAO.VoteOption",
        name: "option",
        type: "uint8",
      },
    ],
    name: "voteFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506127d0806100206000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c8063abe7c08e1161008c578063bdc82d9911610066578063bdc82d99146101dd578063c4d0e4bf146101f9578063d1ab0c4114610215578063ffba7b0b14610233576100cf565b8063abe7c08e1461016c578063b6b55f2514610188578063b91e8997146101a4576100cf565b806311ecc508146100d45780633ccfd60b146100f2578063432c46c6146100fc57806347dfdd6e14610118578063677c3f9c14610134578063943e821614610150575b600080fd5b6100dc610263565b6040516100e99190612023565b60405180910390f35b6100fa610268565b005b610116600480360381019061011191906118a1565b6103bf565b005b610132600480360381019061012d919061180e565b6103d1565b005b61014e60048036038101906101499190611860565b610414565b005b61016a600480360381019061016591906119fd565b610434565b005b61018660048036038101906101819190611920565b610443565b005b6101a2600480360381019061019d9190611920565b6108aa565b005b6101be60048036038101906101b99190611920565b6109c5565b6040516101d49a99989796959493929190611e19565b60405180910390f35b6101f760048036038101906101f2919061180e565b610beb565b005b610213600480360381019061020e91906119ae565b610c6c565b005b61021d610e18565b60405161022a9190611db3565b60405180910390f35b61024d60048036038101906102489190611972565b610e3c565b60405161025a9190611dce565b60405180910390f35b603281565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050806002015442116102f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e890611f43565b60405180910390fd5b6000816000015490506000826000018190555042826001018190555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b8152600401610368929190611d8a565b602060405180830381600087803b15801561038257600080fd5b505af1158015610396573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ba9190611837565b505050565b6103cc8360028484610ea7565b505050565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610431816002600060405180602001604052806000815250610ea7565b50565b61043f8233836110fd565b5050565b80600060026000838152602001908152602001600020600101541161049d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161049490611ec3565b60405180910390fd5b60006002600084815260200190815260200160002090506000816002015482600101546104ca9190612146565b905080421161050e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161050590611fe3565b60405180910390fd5b60006003811115610548577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8260060160009054906101000a900460ff166003811115610592577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b146105d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105c990611f83565b60405180910390fd5b600080836005015484600401546105e99190612146565b9050600060646032866003015461060091906121cd565b61060a919061219c565b90508082106106365784600501548560040154111561062c5760019250610631565b600292505b61063b565b600392505b828560060160006101000a81548160ff02191690836003811115610688577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b0217905550600160038111156106c7577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b836003811115610700577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156108675760016002811115610740577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8560060160019054906101000a900460ff16600281111561078a577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156108665760008560060160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16866007016040516107de9190611d05565b6000604051808303816000865af19150503d806000811461081b576040519150601f19603f3d011682016040523d82523d6000602084013e610820565b606091505b5050905080610864576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161085b90611f23565b60405180910390fd5b505b5b867f97ca203159b9960795bc854a1cf165da55784bb792cd45b04a997b0996969e88838560405161089992919061203e565b60405180910390a250505050505050565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050818160000160008282546109019190612146565b9250508190555042816001018190555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330856040518463ffffffff1660e01b815260040161096e93929190611d1c565b602060405180830381600087803b15801561098857600080fd5b505af115801561099c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109c09190611837565b505050565b606060008060008060008060008060608a6000600260008381526020019081526020016000206001015411610a2f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a2690611ec3565b60405180910390fd5b6000600260008e8152602001908152602001600020905080600001816001015482600201548360030154846004015485600501548660060160009054906101000a900460ff168760060160019054906101000a900460ff168860060160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1689600701898054610abc90612378565b80601f0160208091040260200160405190810160405280929190818152602001828054610ae890612378565b8015610b355780601f10610b0a57610100808354040283529160200191610b35565b820191906000526020600020905b815481529060010190602001808311610b1857829003601f168201915b50505050509950808054610b4890612378565b80601f0160208091040260200160405190810160405280929190818152602001828054610b7490612378565b8015610bc15780601f10610b9657610100808354040283529160200191610bc1565b820191906000526020600020905b815481529060010190602001808311610ba457829003601f168201915b505050505090509b509b509b509b509b509b509b509b509b509b5050509193959799509193959799565b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600073ffffffffffffffffffffffffffffffffffffffff16600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610d3b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d3290611fa3565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610e08576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dff90611ee3565b60405180910390fd5b610e138383836110fd565b505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006002600084815260200190815260200160002060080160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60006203f480905060006002600060016000815480929190610ec8906123db565b919050558152602001908152602001600020905060008160060160006101000a81548160ff02191690836003811115610f2a577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b0217905550848160060160016101000a81548160ff02191690836002811115610f7c577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b021790555085816000019080519060200190610f999291906115ac565b50428160010181905550818160020181905550838160060160026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082816007019080519060200190611007929190611632565b5060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b15801561106e57600080fd5b505afa158015611082573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110a69190611949565b8160030181905550600180546110bc9190612227565b7fca8aa543d351c1c4996be153127dbdcc10410245e7ee62094ce236d48ec38df487876040516110ed929190611de9565b60405180910390a2505050505050565b826000600260008381526020019081526020016000206001015411611157576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161114e90611ec3565b60405180910390fd5b60006002600086815260200190815260200160002090506000600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000826002015483600101546111c79190612146565b905042811161120b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161120290611f63565b60405180910390fd5b60006002811115611245577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b85600281111561127e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156112bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112b690612003565b60405180910390fd5b600060028111156112f9577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8360080160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff166002811115611380577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b146113c0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113b790611fc3565b60405180910390fd5b6000826000015490506001811161140c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161140390611f03565b60405180910390fd5b858460080160008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690836002811115611496577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b0217905550600160028111156114d5577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b86600281111561150e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b141561153457808460040160008282546115289190612146565b92505081905550611550565b808460050160008282546115489190612146565b925050819055505b8260020154821115611566578183600201819055505b877f86f3fc303848d79e408c838630014031d0442602a980c1ee15562bc7578ac6e288888460405161159a93929190611d53565b60405180910390a25050505050505050565b8280546115b890612378565b90600052602060002090601f0160209004810192826115da5760008555611621565b82601f106115f357805160ff1916838001178555611621565b82800160010185558215611621579182015b82811115611620578251825591602001919060010190611605565b5b50905061162e91906116b8565b5090565b82805461163e90612378565b90600052602060002090601f01602090048101928261166057600085556116a7565b82601f1061167957805160ff19168380011785556116a7565b828001600101855582156116a7579182015b828111156116a657825182559160200191906001019061168b565b5b5090506116b491906116b8565b5090565b5b808211156116d15760008160009055506001016116b9565b5090565b60006116e86116e38461208c565b612067565b90508281526020810184848401111561170057600080fd5b61170b848285612336565b509392505050565b6000611726611721846120bd565b612067565b90508281526020810184848401111561173e57600080fd5b611749848285612336565b509392505050565b60008135905061176081612745565b92915050565b6000815190506117758161275c565b92915050565b600082601f83011261178c57600080fd5b813561179c8482602086016116d5565b91505092915050565b6000813590506117b481612773565b92915050565b600082601f8301126117cb57600080fd5b81356117db848260208601611713565b91505092915050565b6000813590506117f381612783565b92915050565b60008151905061180881612783565b92915050565b60006020828403121561182057600080fd5b600061182e84828501611751565b91505092915050565b60006020828403121561184957600080fd5b600061185784828501611766565b91505092915050565b60006020828403121561187257600080fd5b600082013567ffffffffffffffff81111561188c57600080fd5b611898848285016117ba565b91505092915050565b6000806000606084860312156118b657600080fd5b600084013567ffffffffffffffff8111156118d057600080fd5b6118dc868287016117ba565b93505060206118ed86828701611751565b925050604084013567ffffffffffffffff81111561190a57600080fd5b6119168682870161177b565b9150509250925092565b60006020828403121561193257600080fd5b6000611940848285016117e4565b91505092915050565b60006020828403121561195b57600080fd5b6000611969848285016117f9565b91505092915050565b6000806040838503121561198557600080fd5b6000611993858286016117e4565b92505060206119a485828601611751565b9150509250929050565b6000806000606084860312156119c357600080fd5b60006119d1868287016117e4565b93505060206119e286828701611751565b92505060406119f3868287016117a5565b9150509250925092565b60008060408385031215611a1057600080fd5b6000611a1e858286016117e4565b9250506020611a2f858286016117a5565b9150509250929050565b611a428161225b565b82525050565b6000611a5382612103565b611a5d8185612119565b9350611a6d818560208601612345565b611a768161250f565b840191505092915050565b60008154611a8e81612378565b611a98818661212a565b94506001821660008114611ab35760018114611ac457611af7565b60ff19831686528186019350611af7565b611acd856120ee565b60005b83811015611aef57815481890152600182019150602081019050611ad0565b838801955050505b50505092915050565b611b09816122dc565b82525050565b611b1881612300565b82525050565b611b2781612312565b82525050565b611b3681612324565b82525050565b6000611b478261210e565b611b518185612135565b9350611b61818560208601612345565b611b6a8161250f565b840191505092915050565b6000611b82601083612135565b9150611b8d82612520565b602082019050919050565b6000611ba5602083612135565b9150611bb082612549565b602082019050919050565b6000611bc8602083612135565b9150611bd382612572565b602082019050919050565b6000611beb601e83612135565b9150611bf68261259b565b602082019050919050565b6000611c0e601583612135565b9150611c19826125c4565b602082019050919050565b6000611c31601783612135565b9150611c3c826125ed565b602082019050919050565b6000611c54601783612135565b9150611c5f82612616565b602082019050919050565b6000611c77603a83612135565b9150611c828261263f565b604082019050919050565b6000611c9a601883612135565b9150611ca58261268e565b602082019050919050565b6000611cbd601383612135565b9150611cc8826126b7565b602082019050919050565b6000611ce0600c83612135565b9150611ceb826126e0565b602082019050919050565b611cff816122d2565b82525050565b6000611d118284611a81565b915081905092915050565b6000606082019050611d316000830186611a39565b611d3e6020830185611a39565b611d4b6040830184611cf6565b949350505050565b6000606082019050611d686000830186611a39565b611d756020830185611b0f565b611d826040830184611cf6565b949350505050565b6000604082019050611d9f6000830185611a39565b611dac6020830184611cf6565b9392505050565b6000602082019050611dc86000830184611b00565b92915050565b6000602082019050611de36000830184611b0f565b92915050565b60006040820190508181036000830152611e038185611b3c565b9050611e126020830184611b2d565b9392505050565b6000610140820190508181036000830152611e34818d611b3c565b9050611e43602083018c611cf6565b611e50604083018b611cf6565b611e5d606083018a611cf6565b611e6a6080830189611cf6565b611e7760a0830188611cf6565b611e8460c0830187611b1e565b611e9160e0830186611b2d565b611e9f610100830185611a39565b818103610120830152611eb28184611a48565b90509b9a5050505050505050505050565b60006020820190508181036000830152611edc81611b75565b9050919050565b60006020820190508181036000830152611efc81611b98565b9050919050565b60006020820190508181036000830152611f1c81611bbb565b9050919050565b60006020820190508181036000830152611f3c81611bde565b9050919050565b60006020820190508181036000830152611f5c81611c01565b9050919050565b60006020820190508181036000830152611f7c81611c24565b9050919050565b60006020820190508181036000830152611f9c81611c47565b9050919050565b60006020820190508181036000830152611fbc81611c6a565b9050919050565b60006020820190508181036000830152611fdc81611c8d565b9050919050565b60006020820190508181036000830152611ffc81611cb0565b9050919050565b6000602082019050818103600083015261201c81611cd3565b9050919050565b60006020820190506120386000830184611cf6565b92915050565b60006040820190506120536000830185611cf6565b6120606020830184611b1e565b9392505050565b6000612071612082565b905061207d82826123aa565b919050565b6000604051905090565b600067ffffffffffffffff8211156120a7576120a66124e0565b5b6120b08261250f565b9050602081019050919050565b600067ffffffffffffffff8211156120d8576120d76124e0565b5b6120e18261250f565b9050602081019050919050565b60008190508160005260206000209050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b6000612151826122d2565b915061215c836122d2565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561219157612190612424565b5b828201905092915050565b60006121a7826122d2565b91506121b2836122d2565b9250826121c2576121c1612453565b5b828204905092915050565b60006121d8826122d2565b91506121e3836122d2565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561221c5761221b612424565b5b828202905092915050565b6000612232826122d2565b915061223d836122d2565b9250828210156122505761224f612424565b5b828203905092915050565b6000612266826122b2565b9050919050565b60008115159050919050565b600081905061228782612709565b919050565b600081905061229a8261271d565b919050565b60008190506122ad82612731565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006122e7826122ee565b9050919050565b60006122f9826122b2565b9050919050565b600061230b82612279565b9050919050565b600061231d8261228c565b9050919050565b600061232f8261229f565b9050919050565b82818337600083830152505050565b60005b83811015612363578082015181840152602081019050612348565b83811115612372576000848401525b50505050565b6000600282049050600182168061239057607f821691505b602082108114156123a4576123a36124b1565b5b50919050565b6123b38261250f565b810181811067ffffffffffffffff821117156123d2576123d16124e0565b5b80604052505050565b60006123e6826122d2565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561241957612418612424565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f566f74696e67206e6f7420666f756e6400000000000000000000000000000000600082015250565b7f596f752063616e6e6f7420766f746520666f7220746869732061646472657373600082015250565b7f42616c616e6365206973206e6f7420656e6f75676820666f7220766f74696e67600082015250565b7f566f74696e672066696e697368656420756e7375636365737366756c6c790000600082015250565b7f546f6f206561726c7920746f2077697468647261770000000000000000000000600082015250565b7f566f74696e6720697320616c726561647920656e646564000000000000000000600082015250565b7f566f74696e6720616c72656164792066696e6973686564000000000000000000600082015250565b7f54686973206164647265737320646964206e6f742064656c656761746520686960008201527f7320766f74657320746f20616e79206164647265737320796574000000000000602082015250565b7f5468652061647265737320616c726561647920766f7465640000000000000000600082015250565b7f546f6f206561726c7920746f2066696e69736800000000000000000000000000600082015250565b7f496e76616c696420766f74650000000000000000000000000000000000000000600082015250565b6003811061271a57612719612482565b5b50565b6004811061272e5761272d612482565b5b50565b6003811061274257612741612482565b5b50565b61274e8161225b565b811461275957600080fd5b50565b6127658161226d565b811461277057600080fd5b50565b6003811061278057600080fd5b50565b61278c816122d2565b811461279757600080fd5b5056fea26469706673582212200d7326bb028dfbf8ba8f81ff559d15fe4560c7adae15db3dad4d090f05d1400064736f6c63430008040033";

type DAOConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DAOConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DAO__factory extends ContractFactory {
  constructor(...args: DAOConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DAO> {
    return super.deploy(overrides || {}) as Promise<DAO>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DAO {
    return super.attach(address) as DAO;
  }
  connect(signer: Signer): DAO__factory {
    return super.connect(signer) as DAO__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DAOInterface {
    return new utils.Interface(_abi) as DAOInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): DAO {
    return new Contract(address, _abi, signerOrProvider) as DAO;
  }
}
