import React from 'react';
import {IUdMessageInfo} from "../../../index";
import {Button} from "antd";

interface ITextItemProps {
    message: IUdMessageInfo
}

const TextItem: React.FC<ITextItemProps> = (props: ITextItemProps) => {

    return <><span>{props.message.content}</span><Button>查看</Button></>;

}

export default TextItem;
