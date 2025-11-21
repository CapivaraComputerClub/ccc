import {Server} from "http";
import ejs from 'ejs';

const server = new Server((req, res) => {
    
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});