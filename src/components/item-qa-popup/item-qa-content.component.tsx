import { Input } from 'antd';

const { Search } = Input;

export function ItemQAContent(props) {

    return  <Search
        placeholder="input search loading with enterButton"
        variant="borderless"
        autoFocus
        onSearch={(value, e)=>props.onPrompt(value, e)}
        loading={props.loading}
        enterButton />
}