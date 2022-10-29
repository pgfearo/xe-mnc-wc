import Split from "split.js";
import testSource from '../assets/test.xsl';
import { plEditor } from "../monaco/highlighting";

export class XEditor extends HTMLElement {
    static get observedAttributes() {
        return ['height'];
    }

    private height: string|null = null;

    constructor() {
        super();
        this.height = this.getAttribute('height');
    }
    async connectedCallback() {
        const editorHeight = this.height? this.height : '100%';
        const splitHTML = `
<div class="split">
    <div id="split-0">
		<div class="group">
			<div class="tab-bar"></div>
			<div id="ed1" class="editor"></div>
			<div class="tab-bar"></div>
		</div>
	</div>
    <div id="split-1">
		<div class="group">
			<div class="tab-bar"></div>
			<div id="ed2" class="editor"></div>
			<div class="tab-bar"></div>
		</div>
	</div>
</div>
`;

        const fullEditorHTML = `
<div class="top" style="height:${editorHeight}">
	<div class="tab-bar"></div>
	${splitHTML}
	<div class="tab-bar"></div>
</div>
`;

        this.innerHTML = fullEditorHTML;

        const leftPanel = <HTMLElement>document.querySelector('#ed1');
        const rightPanel = <HTMLElement>document.querySelector('#ed2');

        Split(['#split-0', '#split-1']);

        const newEditor1 = plEditor(leftPanel);
        const newEditor2 = plEditor(rightPanel);

        //const response = await fetch('assets/test.xsl');
        //console.log('response', response);
        console.log('test.xsl', testSource);

        newEditor1.setValue("<test/>");
    }

    disconnectedCallback() {

    }
}