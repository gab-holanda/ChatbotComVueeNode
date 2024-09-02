const PORT = 8000;
const express = require("express");
const cors = require("cors");
const multer = require("multer"); // Middleware para upload de arquivos
const admin = require("firebase-admin");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

// Configuração do Firebase Admin SDK
const serviceAccount = require(process.env.FirebaseAdminSDK);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASEURL,
  storageBucket: process.env.STORAGEBUCKET // Nome correto do bucket do projeto
});

const bucket = admin.storage().bucket();

// Configuração do multer para salvar arquivos temporariamente no servidor
const upload = multer({ dest: "uploads/" });

// Rota para upload de imagem e palavra-chave
app.post("/upload", upload.single("image"), async (req, res) => {
  const { keyword } = req.body;
  const file = req.file;


  if (!keyword || !file) {
    return res.status(400).send("Palavra-chave e imagem são obrigatórios.");
  }


  try {
    // Fazendo o upload da imagem para o Firebase Storage
    const uploadPath = path.join(__dirname, file.path);
    const [uploadedFile] = await bucket.upload(uploadPath, {
      destination: `images/${file.originalname}`, // Caminho no bucket onde a imagem será salva
    });

    // Obter a URL pública do arquivo
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${uploadedFile.name}`;

    const imageDestination = `images/${file.originalname}`

    const bucketFile = bucket.file(imageDestination);
    await bucketFile.makePublic();

    // Salvando no Realtime Database
    const db = admin.database();
    const ref = db.ref("sports");
    await ref.child(keyword).set(imageUrl);

    // Deletar o arquivo temporário do servidor
    require('fs').unlinkSync(uploadPath);


    res.status(200).send({ message: "Upload realizado com sucesso!", imageUrl });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    res.status(500).send("Erro ao fazer upload.");
  }
});


// Rota para enviar mensagens para o ChatGPT
const API_KEY = process.env.API_CHATGPT


app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      //model: "gpt-3.5-turbo",
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: req.body.message }],
      //max_tokens: 100,
    }),
  };
    // com a palavra-chave em mãos, acessar a realtime database para pegar o sports.palavraChave
    const db =  admin.database();
    const ref = await db.ref(`sports`);


    // extração da palavra-chave do req.body.message
    let sportsData;
    await ref.once('value', (snapshot) => {
      if (snapshot.exists()) sportsData = snapshot.val();
      
    }, (error) => {
      console.error("erro: ", error);
    });
    
    let keyword = ""
    const keys = Object.keys(sportsData);
      
    // Iterate over the keys
    for (const key of keys) {
      // Check if the key is in the string
      if (req.body.message.includes(key)) {
        keyword = key; 
      }
    }


  // Obter o URL da imagem armazenada no Realtime Database
  let imageUrl = sportsData[keyword];

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    const resp = {opeanAi: data, imageUrl: imageUrl}
    
    res.send(resp)
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao se comunicar com o ChatGPT.");
  }
});


app.listen(PORT, () => console.log(`Your server is running on PORT ${PORT}`));



