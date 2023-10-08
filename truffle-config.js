module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",    
      port: 7545,            
      network_id: "*",       
      gas: 6721975,          
      gasPrice: 20000000000, 
    },
  },
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
