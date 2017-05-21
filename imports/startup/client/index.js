// Import client startup through a single index entry point

import './routes.js';

// import './autorun.js';
// import '../../ui/components/search/search.js';
import { Quizes } from '../../api/quizes/quizes';

window.Quizes = Quizes;
