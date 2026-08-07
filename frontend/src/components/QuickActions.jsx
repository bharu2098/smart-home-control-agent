import {

    FaLightbulb,

    FaFan,

    FaMobileAlt,

    FaBolt,

    FaListOl,

} from "react-icons/fa";

function QuickActions({

    onSelect,

    loading,

}) {

    const actions = [

        {

            icon: <FaLightbulb />,

            label: "Turn on Hall Light",

        },

        {

            icon: <FaFan />,

            label: "Turn off Bedroom Fan",

        },

        {

            icon: <FaMobileAlt />,

            label: "Show my devices",

        },

        {

            icon: <FaBolt />,

            label: "Show my automations",

        },

        {

            icon: <FaListOl />,

            label: "How many devices do I have?",

        },

    ];

    return (

        <div className="quick-actions">

            {

                actions.map(

                    (

                        action,

                        index

                    ) => (

                        <button

                            key={index}

                            disabled={loading}

                            onClick={() =>

                                onSelect(

                                    action.label

                                )

                            }

                        >

                            {action.icon}

                            <span>

                                {action.label}

                            </span>

                        </button>

                    )

                )

            }

        </div>

    );

}

export default QuickActions;