import React, {useEffect, useState, useRef}from "react";
import { timer ,fromEvent} from 'rxjs'
import { debounceTime, buffer, throttleTime, filter } from 'rxjs/operators';

import './Timer.css'

const timer$ = timer(1000);

const Timer = () => {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);
    const [click, setClick] = useState(false);

    const button = useRef(null);

    const getTime= ( time ) => {
        switch(time){
            case 'hh': return (count/3600).toFixed(0) < 10 ? '0' + (count/3600).toFixed(0) : (count/3600).toFixed(0);
            case 'mm': return Math.floor(count/60 % 60) < 10 ? '0' + Math.floor(count/60 % 60) : Math.floor(count/60 % 60);
            case 'ss': return count%60 < 10 ? '0' + count%60 : count%60;
            default : return null;
        }

    }

    const handleCount = () => setCount(prev => prev + 1);
    const handleFlag = () => {
        if(!flag) setFlag(true);
        else{
            setFlag(false);
            setCount(0);
        }
    }
    const handleDoubleClick = () => setClick(() => !click);


    useEffect(()=>{

        const subscribe = timer$.subscribe( val => {
            if(flag) handleCount()
        })

        return () => {
            subscribe.unsubscribe()
        }
    },[count,flag]);

    useEffect( () => {

        const clk$ = fromEvent(button.current, 'click');

        const doubleClick$ = clk$.pipe(
            buffer(clk$.pipe(throttleTime(300))),
            filter(clickArray => clickArray.length > 1)
        ).subscribe( events =>{
            setFlag(prev => false)
        });


         return () => doubleClick$.unsubscribe()

    },[flag])
    return (
        <>
            <p>
                <span>{ getTime('hh') }</span>
                <span>{ getTime('mm') }</span>
                <span>{ getTime('ss') }</span>
            </p>
            <div className='buttonContainer'>
                <button onClick={()=> handleFlag()}>{flag? 'stop': 'start'}</button>
                <button ref={button} onClick={()=> handleDoubleClick()}>wait</button>
                <button onClick={() => setCount(0)}>reset</button>
            </div>

        </>
        )
    }

    export  default Timer;