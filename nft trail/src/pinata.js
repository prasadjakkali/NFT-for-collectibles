//require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

const axios = require('axios');
const FormData = require('form-data');

export const uploadJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSON.stringify(JSONBody), {
            headers: {
                "content-type": "application/json",
                pinata_api_key: "25d0ad4cc316b0fe18d7",
                pinata_secret_api_key: "7f83439f7383ac03c9d88198300d19ddcbea36d4ff2402298edbe0c0bda1f7a1",
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

export const uploadFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    
    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    // //pinataOptions are optional
    // const pinataOptions = JSON.stringify({
    //     cidVersion: 0,
    //     customPinPolicy: {
    //         regions: [
    //             {
    //                 id: 'FRA1',
    //                 desiredReplicationCount: 1
    //             },
    //             {
    //                 id: 'NYC1',
    //                 desiredReplicationCount: 2
    //             }
    //         ]
    //     }
    // });
    // data.append('pinataOptions', pinataOptions);

    return axios 
        .post(url, data, {
            maxBodyLength: '256',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: "25d0ad4cc316b0fe18d7",
                pinata_secret_api_key: "7f83439f7383ac03c9d88198300d19ddcbea36d4ff2402298edbe0c0bda1f7a1",
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data.IpfsHash)
            //alert("ïmage uploaded")
            return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

// pinata_api_key: "b3e6de59cd76159e23c2",
// pinata_secret_api_key: "2602fd6ff021746c6bf694bcf13e015e882289242affed73a76f21439b821ded",



//API Key: 25d0ad4cc316b0fe18d7
//  API Secret: 7f83439f7383ac03c9d88198300d19ddcbea36d4ff2402298edbe0c0bda1f7a1