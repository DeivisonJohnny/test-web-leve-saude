// FeedbacksSeed.ts

// 1. Importe e configure o dotenv no topo do arquivo
import 'dotenv/config';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const feedbacks = [
  {
    id: '1',
    userName: 'João Silva',
    rating: 5,
    comment: 'Excelente serviço! Muito satisfeito com o atendimento e a qualidade do produto.',
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    userName: 'Maria Santos',
    rating: 4,
    comment: 'Bom produto, entrega rápida. Apenas o preço poderia ser um pouco melhor.',
    createdAt: '2024-01-14T15:45:00',
  },
  {
    id: '3',
    userName: 'Pedro Oliveira',
    rating: 3,
    comment: 'Produto ok, mas o atendimento ao cliente precisa melhorar.',
    createdAt: '2024-01-13T09:15:00',
  },
  {
    id: '4',
    userName: 'Ana Costa',
    rating: 5,
    comment: 'Perfeito! Superou minhas expectativas. Recomendo para todos.',
    createdAt: '2024-01-12T14:20:00',
  },
  {
    id: '5',
    userName: 'Carlos Ferreira',
    rating: 2,
    comment: 'Produto chegou com defeito. Processo de troca foi demorado.',
    createdAt: '2024-01-11T11:00:00',
  },
];

async function seedFeedbacks() {
  try {
    console.log('Iniciando o seed de feedbacks...');
    for (const feedback of feedbacks) {
      await set(ref(database, `feedbacks/${feedback.id}`), feedback);
      console.log(`Feedback ${feedback.id} inserido.`);
    }
    console.log('✅ Feedbacks inseridos com sucesso!');
  } catch (error) {
    // 3. Capture e mostre qualquer erro que ocorrer
    console.error('❌ Erro ao inserir feedbacks:', error);
  } finally {
    // É uma boa prática fechar a conexão se o script for simples,
    // mas para o Realtime Database não há um método direto `close()`.
    // O processo será encerrado automaticamente.
    console.log('Script finalizado.');
    process.exit(0); // Força a saída do processo
  }
}

seedFeedbacks();
