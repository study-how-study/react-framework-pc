import React from 'react';
import {IUdMessageInfo} from "../../../index";

interface IVoiceItemProps {
    message: IUdMessageInfo
}

const VoiceItem: React.FC<IVoiceItemProps> = (props: IVoiceItemProps) => {

    return <>
        <audio autoPlay={false} src={props.message.alertTone} controls={true}>
            <span>语音消息</span>
        </audio>
    </>;
}

export default VoiceItem;
