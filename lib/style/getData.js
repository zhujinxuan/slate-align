// @flow

const tagTextAlign = ['div', 'p', 'h1', 'h2', 'h3', 'ul', 'ol'];
const tagFloat = ['div', 'p', 'h1', 'h2', 'h3', 'img'];
const tagNames = [...tagTextAlign, ...tagFloat];
const alignments = ['left', 'center', 'right'];

function getData(el: Element): { textAlign?: string } {
    if (tagNames.indexOf(el.tagName.toLowerCase()) === -1) {
        return {};
    }
    if (el.getAttribute('align')) {
        const align: ?string = el.getAttribute('align');
        if (align && alignments.indexOf(align) > -1) {
            return { textAlign: align };
        }
    }

    if (tagTextAlign.indexOf(el.tagName.toLowerCase()) > -1) {
        if (el.style && el.style.textAlign) {
            const align: ?string = el.getAttribute('align');
            if (align && alignments.indexOf(align) > -1) {
                return { textAlign: align };
            }
        }
    }

    if (
        el.style &&
        typeof el.style.float === 'string' &&
        el.style.float !== 'clear'
    ) {
        const align: string = el.style.float;
        if (align && alignments.indexOf(align) > -1) {
            return { textAlign: align };
        }
    }
    return {};
}

export default getData;
