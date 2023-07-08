import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import { useLocation, useParams } from 'react-router-dom';
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";

export default function NFTPage (props) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");
var OrginalURL ="";

async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    let meta = await axios.get(tokenURI);
    OrginalURL=tokenURI;
    console.log(OrginalURL);
    meta = meta.data;
    console.log(listedToken);

    let item = {
        price: ethers.utils.formatUnits(listedToken.price.toString(), 'ether'),
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
    }
    console.log(item);
    //var link="https://sepolia.etherscan.io/nft/0xa4Ac6Cd37bC053a1a08aB1d208CF4B492BF5cE41/" + tokenId ;
    //console.log(link);
    //console.log(ethers.utils.formatUnits(listedToken.price.toString(), 'ether'));
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr)
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        //run the executeSale function
        let transaction = await contract.executeSale(tokenId, {value:salePrice});
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

async function changePrice(){
    try {
        const ethers = require("ethers");
         //After adding your Hardhat network to your metamask, this code will get providers and signers
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

        // //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        var price=0.0;
        var newURI;
        let updateprice = prompt("Please Enter the PRICE","0.01")
        if(updateprice!=null){
            price=updateprice;
        }
                //Make sure that none of the fields are empty
        if( !data.name || !data.description || !price || !data.image == null){
            alert("price cannot be empty");
            return;}
            const name=data.name;
            const description=data.description;
            const iurl = data.image;

        const nftJSON = {
            name, description,price, image: iurl
        }
        console.log(nftJSON);
        //alert(nftJSON);
        //upload the metadata JSON to IPFS
        const response = await uploadJSONToIPFS(nftJSON);
        if(response.success === true){
            console.log("Uploaded JSON to Pinata: ", response)
            alert("json updated")
            newURI =response.pinataURL;
            console.log(response.pinataURL);
        }
        
        const changefee = await contract.getListPrice();
        const change = changefee.toString();
        const newPrice = ethers.utils.parseUnits(price, 'ether');
        //const changefee =ethers.utils.parseUnits(change, 'ether');
        if(newURI!==null){
        console.log(newPrice);
        console.log(changefee); 
        let changeprice = await contract.updateTokenPrice(tokenId,newURI,newPrice, data.seller ,{ value: change });
        await changeprice.wait();
        //var listprice=await contract.updateTokenPrice();
        alert('Price of the NFT changed Successfully');
        console.log('Price of the NFT changed Successfully')
        //updateMessage('Price of the NFT changed Successfully',listprice);
        }
    }
    catch(e) {
        alert("Could not update price try later()due to Error"+e)
    }

}

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);


    return(
        <div style={{"min-height":"100vh"}}>
            <Navbar></Navbar>
            <div className="flex ml-20 mt-20">
                <img src={data.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        TokenID: {tokenId}
                    </div>
                    <div>
                        Price: <span className="">{data.price + " SEPOLIA ETH"}</span>
                    </div>
                    <div>
                        Owner: <span className="text-sm">{data.owner}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{data.seller}</span>
                    </div>
                    <div>
                    { currAddress == data.owner || currAddress == data.seller ?
                        
                        <div className="text-yellow-700"><h3>You are the owner of this NFT</h3><br></br><br></br><button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={changePrice}>change price</button></div>
                        : 
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                    }
                    
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                    <div>
                        <a href={"https://sepolia.etherscan.io/nft/0xa4Ac6Cd37bC053a1a08aB1d208CF4B492BF5cE41/" + tokenId} >VIEW ON BLOCKCHAIN</a>
                    </div>
                </div>
            </div>
        </div>
    )
}