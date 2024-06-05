const express = require('express');
const router = express.Router();
const expressIp = require('express-ip');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../ipLogs.json');

const saveIpToFile = (ip) => {
  let ipLogs = [];
  if (fs.existsSync(logFilePath)) {
    const data = fs.readFileSync(logFilePath, 'utf-8');
    ipLogs = JSON.parse(data);
  }
  ipLogs.push({ ip, timestamp: new Date() });
  fs.writeFileSync(logFilePath, JSON.stringify(ipLogs, null, 2), 'utf-8');
};

router.use(expressIp().getIpInfoMiddleware);

router.post('/ipnguoidung', (req, res) => {
  const userIp = req.ipInfo.ip;
  saveIpToFile(userIp);
  res.status(200).json({ message: 'IP logged successfully', ip: userIp });
});

module.exports = router;
