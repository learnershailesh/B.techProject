# MetaMask Login Troubleshooting Guide

## Prerequisites
1. **MetaMask Extension**: Make sure MetaMask is installed in your browser
2. **MongoDB**: Ensure MongoDB is running locally or update the connection string
3. **Node.js**: Make sure you have Node.js installed

## Step-by-Step Debugging

### 1. Start the Server
```bash
cd server
node server.js
```

You should see:
```
Server running on port 5000
```

### 2. Check MongoDB Connection
If you see MongoDB connection errors, you need to:
- Install MongoDB locally, OR
- Use MongoDB Atlas (cloud database)

Update `server/config.env`:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/realestate
```

### 3. Test Server Endpoints
```bash
cd server
node test-server.js
```

### 4. Start the Frontend
```bash
cd client
npm run dev
```

### 5. Check Browser Console
Open browser developer tools (F12) and check the Console tab for errors.

### 6. Common Issues & Solutions

#### Issue: "MetaMask is not installed"
**Solution**: Install MetaMask browser extension

#### Issue: "Cannot connect to server"
**Solution**: 
- Make sure server is running on port 5000
- Check if port 5000 is not used by another application
- Try changing the port in `server/config.env`

#### Issue: "No accounts found"
**Solution**: 
- Make sure MetaMask is unlocked
- Make sure you have at least one account in MetaMask
- Try switching networks in MetaMask

#### Issue: "Invalid signature"
**Solution**:
- Make sure you're signing the exact message shown
- Try refreshing the page and trying again
- Check if MetaMask is connected to the correct network

#### Issue: "User not found"
**Solution**:
- This is normal for first-time users
- The system will create a new user automatically

## Debug Information

The updated code now includes detailed console logging. Check:

1. **Browser Console** for frontend logs
2. **Server Console** for backend logs
3. **Network Tab** in browser dev tools for API calls

## Environment Variables

Make sure `server/config.env` contains:
```
MONGODB_URI=mongodb://localhost:27017/realestate
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## Testing MetaMask Connection

1. Open browser console
2. Try connecting MetaMask
3. Look for these log messages:
   - "MetaMask detected, requesting accounts..."
   - "Connected address: [your-address]"
   - "Getting nonce from server..."
   - "Nonce received: [data]"
   - "Signing message: [message]"
   - "Signature created: [signature]"
   - "Verifying signature..."
   - "Auth response: [data]"

If any step fails, the error will be clearly displayed. 