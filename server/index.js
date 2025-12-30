import app from './src/app.js';
import { connectDB } from './src/db/db.js';
import { initMailer } from './src/utils/sendEmail.js';

// Connect to the database & initialize mailer
connectDB();
initMailer();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening to server at http://localhost:${process.env.PORT}`);
});
