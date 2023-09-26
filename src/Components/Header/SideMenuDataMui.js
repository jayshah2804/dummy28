import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdOutlineDashboard,
} from "react-icons/md";

const SideMenuData = (props) => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <React.Fragment>
            {props.menu.map((menu, index) => {
                return (
                    <Accordion sx={{ boxShadow: "none", position: "none" }} expanded={(expanded === index) && menu.sub} onChange={handleChange(index)}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }} >
                            {props.iconFlag === "1" && <MdOutlineDashboard />}
                            <AccordionSummary
                                expandIcon={menu.sub && <ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                {/* <Typography> */}
                                {menu.main}
                                {/* </Typography> */}
                            </AccordionSummary>
                        </div>
                        {menu.sub &&
                            <AccordionDetails>
                                <Typography>
                                    <SideMenuData menu={menu.sub} iconFlag="0" />
                                </Typography>
                            </AccordionDetails>
                        }
                    </Accordion>
                );
            })}
        </React.Fragment>
    )
}

export default SideMenuData