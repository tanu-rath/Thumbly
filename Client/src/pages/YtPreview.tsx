import { useSearchParams } from 'react-router-dom';
import { yt_html } from '../assets/assets';

const YtPreview = () => {
    const [searchParams] = useSearchParams();

    const thumbnail_url = searchParams.get('thumbnail_url') || '';
    const title = searchParams.get('title') || '';

    // Escape user-controlled values before putting them in HTML, and only allow https image URLs
    const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const safeUrl = /^https:\/\//i.test(thumbnail_url) ? thumbnail_url : '';

    // Replacer functions avoid special "$&" patterns in String.replace
    const new_html = yt_html.replace('%%THUMBNAIL_URL%%', () => escapeHtml(safeUrl)).replace('%%TITLE%%', () => escapeHtml(title));

    return (
        <div className='fixed inset-0 z-100 bg-noir'>
            <iframe srcDoc={new_html} width='100%' height='100%' allowFullScreen></iframe>
        </div>
    );
};

export default YtPreview;