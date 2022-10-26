import * as monaco from 'monaco-editor';
import { XSLTConfiguration } from './languageConfigurations';
import { BaseToken } from './xpLexer';
import { XslLexer } from './xslLexer';
import { xslThemeData } from './xslThemeData';

const legend: monaco.languages.SemanticTokensLegend = {
	tokenTypes: XslLexer.getTextmateTypeLegend(),
	tokenModifiers: [
		'declaration', 'documentation', 'member', 'static', 'abstract', 'deprecated',
		'modification', 'async'
	]
};

const xsltLang = 'xslt';

monaco.languages.register({ id: xsltLang});

monaco.languages.registerDocumentSemanticTokensProvider(xsltLang, {
	getLegend: function () {
		return legend;
	},
	provideDocumentSemanticTokens: function (model, lastResultId, token) {
        const lines = model.getLinesContent();
        const text = lines.join('\n');
        const xslLexer = new XslLexer(XSLTConfiguration.configuration);
        xslLexer.provideCharLevelState = true;
        const allTokens = xslLexer.analyse(text);
		const data: number[] = [];

		let prevLine = 0;
		let prevChar = 0;

		for (let i = 0; i < allTokens.length; i++) {
			const token: BaseToken = allTokens[i];
			let modifier = 0;
			let line = token.line;
			let char = token.startCharacter;
			data.push(
				// translate line to deltaLine
				line - prevLine,
				// for the same line, translate start to deltaStart
				prevLine === line ? char - prevChar : char,
				token.length,
				token.tokenType,
				modifier
			);

			prevLine = line;
			prevChar = token.startCharacter;
		}

		return {
			data: new Uint32Array(data),
			resultId: null
		};
	},
	releaseDocumentSemanticTokens: function (resultId) {}
});

monaco.editor.defineTheme('xsltTheme', {
	base: 'vs-dark',
	inherit: true,
	colors: {},
	rules: xslThemeData.vsDark
});

const xsltInit = `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"\t\t
xmlns:xs="http://www.w3.org/2001/XMLSchema"
exclude-result-prefixes="#all"
expand-text="yes"
version="3.0">

<xsl:variable name="new" select="for $a in (@*, parent::*/node()) 
          return count($a)"/>

</xsl:stylesheet>`;

export function plEditor(targetElement: HTMLElement) {
    const newEditor = monaco.editor.create(targetElement, {
        value: xsltInit,
        language: xsltLang,
        theme: 'xsltTheme',
        // semantic tokens provider is disabled by default
		'semanticHighlighting.enabled': true,
		'selectOnLineNumbers': true,
		'automaticLayout': true,
		'readOnly': false,
		'minimap': { enabled: false }
    })
    return newEditor;
}
