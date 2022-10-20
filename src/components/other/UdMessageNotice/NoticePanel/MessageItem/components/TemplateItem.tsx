import React from 'react';
import {IUdMessageInfo} from "../../../index";
import {Button} from "antd";

interface ITemplateItemProps {
    message: IUdMessageInfo
}

const TemplateItem: React.FC<ITemplateItemProps> = (props: ITemplateItemProps) => {


    const parseTempate = (content, params: { [key: string]: string } | null) => {
        Object.keys(params).forEach(key => {
            content = content.replace("{" + key + "}", params[key])
        })
        return content;
    }

    return <>{parseTempate(props.message.content, props.message.metadata)} <Button>查看</Button></>;
}

export default TemplateItem;
