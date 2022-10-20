import React from 'react';
import {IUdMessageInfo} from "../../../index";
import {Button} from "antd";

interface ILinkItemProps {
    message: IUdMessageInfo
}

const LinkItem: React.FC<ILinkItemProps> = (props: ILinkItemProps) => {
    return <><span>{props.message.content}</span><Button>前往</Button></>;
}

export default LinkItem;
