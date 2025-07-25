import app from './app';
import { PORT } from './config/env';

app.listen(PORT, () => {
  (`Server running on port ${PORT}`);
}); 