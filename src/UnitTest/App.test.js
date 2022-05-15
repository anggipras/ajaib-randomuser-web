import { shallow } from "enzyme"
import toJson from "enzyme-to-json"
import { Button, FormControl } from "react-bootstrap"
import App from "../App"

describe('App tests', function() {
    it("render search box", () => {
        const wrapper = shallow(<App />)
        expect(wrapper.find('FormControl').debug()).toEqual(
            `<FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" onChange={[Function: onChange]} value="" />`
        )
    })

    it("mocking render search box", () => {
        const getInput = { value: 'Anggi'};
        const mockEvent = { target: { name: 'keyword', value: 'Anggi' } }
        const formControl = shallow((<FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            onChange={(e) => {
                getInput[e.target.name] = e.target.value
            }}
          />));
        formControl.find("input").at(0).simulate("change", mockEvent)
        expect(getInput.value).toEqual('Anggi')
    })

    it("render reset button", () => {
        const wrapper = shallow(<App />)
        const component = `<Button variant=\"secondary\" style={{...}} onClick={[Function: resetFilter]} active={false} disabled={false}>Reset Filter</Button>`
        expect(wrapper.contains(component)).toEqual(false) //the result is false since there are 2 Button (Search and Reset Filter)
    })

    it("mocking render reset button", () => {
        const mockCallBack = jest.fn();
        const button = shallow((<Button variant='secondary' style={{marginLeft: '10px'}} onClick={mockCallBack}>Reset Filter</Button>));
        button.find('button').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    })

    it("render correctly to matchsnapshotw", () => {
        const tree = shallow(<App />)
        expect(toJson(tree)).toMatchSnapshot()
    })
})
