import { AnimatePresence, motion } from "framer-motion";
import { i } from "framer-motion/client";
import { ReactNodeArray } from "prop-types";
import React, { ReactNode, useState } from "react";

type WithName<T extends { name: string } = { name: string }> = T;

const JsxUtil = {
    nl2br: (text: string): ReactNodeArray => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    },


    MoreList: (props: WithName[], options: {
        maxsize?: number;
        moreText?: string;
    }): ReactNodeArray => {

        const {
            maxsize = 3,
            moreText = "...more",
        } = options;

        const [expand, setExpand] = useState<boolean>(false);

        return props.map((prop, i) => (
            i < maxsize || expand ? <li key={i}>{prop.name}
                {i + 1 === maxsize && props.length !== maxsize && !expand ? <span className="more-text" onClick={() => setExpand(true)}>{moreText}</span> : ""}
            </li> : ""
        ));
    },


    AnimationDiv: ({ visible, duration = 0.5, children, onComplete }: {
        visible: boolean;
        duration?: number;
        children?: ReactNode;
        onComplete?: () => void;
    }): ReactNode => {
        return <AnimatePresence initial={false}>
            {visible && (
                <motion.div
                    key={`step${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration }}
                    onAnimationComplete={() => onComplete && onComplete()}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    }

}
export default JsxUtil;