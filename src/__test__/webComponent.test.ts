import WebComponent from "../webComponent";

const templateString = `<div id="test">This is a test</div>`
const templateDom = () => {
    const templateElm = document.createElement("template");
    const divWrap = document.createElement("div");
    divWrap.id = "test";
    divWrap.innerHTML = "This is a test";
    templateElm.content.appendChild(divWrap);
    return templateElm;
}

it('Should error if creating component using a name without a hyphen', () => {
    let errorThrown = false;
    try {
        const wc = new WebComponent('component');
    } catch (err) {
        errorThrown = true;
    }

    expect(errorThrown).toBe(true);
});

it('should create a basic web component', () => {
    const wc = new WebComponent('basic-component');
    const cwc = document.createElement('basic-component');
    expect(cwc.shadowRoot).not.toEqual(undefined);
});

it('should create basic component with template', () => {
    const wc = new WebComponent('comp-with-temp', { template: templateString});
    const cwc = document.createElement('comp-with-temp');
    expect(cwc.shadowRoot?.querySelector?.("#test")?.innerHTML).toBe("This is a test");
});

it('should be able to pass a template element', () => {
    const template = templateDom();
    const wc = new WebComponent('comp-tempdom-arg', {
        template: template
    });
    const cwc = document.createElement('comp-tempdom-arg');
    expect(cwc.shadowRoot?.querySelector?.("#test")?.innerHTML).toBe("This is a test");
});

it('should accept a function that returns a template element', () => {
    const wc = new WebComponent('comp-temp-func', {
        template: templateDom
    });
    const cwc = document.createElement('comp-temp-func');
    expect(cwc.shadowRoot?.querySelector?.("#test")?.innerHTML).toBe("This is a test");
});

it('should accept a function that returns a template string', () => {
    const wc = new WebComponent('comp-temp-func-string', {
        template: () => templateString
    });
    const cwc = document.createElement('comp-temp-func-string');
    expect(cwc.shadowRoot?.querySelector?.("#test")?.innerHTML).toBe("This is a test");
});
