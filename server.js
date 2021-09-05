const express = require('express');
const app = express();

app.use(express.static('./dist/rnhealth'));

app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/rnhealth/'}
  );
});
app.listen(process.env.PORT || 8080);
