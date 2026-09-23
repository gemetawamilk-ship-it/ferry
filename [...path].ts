import express from 'express';
import { apiRouter } from '../server/routes';

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use('/api', apiRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API error:', err);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server E-PESANTREN 360.',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
});

export default app;
