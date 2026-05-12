
import { CHATBOT_DEMOS } from './constants';

const headers = ['Title', 'Description', 'Profile', 'Use Case', 'Tool(s)', 'Link'];
const rows = CHATBOT_DEMOS.map(item => [
  `"${item.title.replace(/"/g, '""')}"`,
  `"${item.description.replace(/"/g, '""')}"`,
  `"${item.profile.replace(/"/g, '""')}"`,
  `"${item.useCase.replace(/"/g, '""')}"`,
  `"${item.toolsUsed.join(', ').replace(/"/g, '""')}"`,
  `"${item.url}"`
]);

console.log(headers.join(','));
rows.forEach(row => console.log(row.join(',')));
