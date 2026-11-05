import { workMarkdown } from '../data/work';
export function GET() {
  return new Response(workMarkdown, { headers: {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Content-Disposition': 'attachment; filename="can-aslan-work.md"',
  } });
}
