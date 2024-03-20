const tokenBlacklist = new Set();

function addToBlacklist(token) {
  tokenBlacklist.add(token);
}

module.exports={
    tokenBlacklist,
    addToBlacklist
}