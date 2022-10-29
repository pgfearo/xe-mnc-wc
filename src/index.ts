import './index.css';
import { XEditor } from './custom-element/x-editor'

// @ts-ignore
self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.bundle.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
};

window.customElements.define('xslt-editor', XEditor);

const bodyDiv = document.createElement('div');
bodyDiv.className = "top-container";


const testHTML = `
<div class="test-div">
  <!--<div style="height:calc(100vh - 220px);background-color:red;">red</div>-->
  <xslt-editor height="calc(100vh - 50px)"></xslt-editor>
</div>
`
	
bodyDiv.innerHTML = testHTML;
document.body.appendChild(bodyDiv);





