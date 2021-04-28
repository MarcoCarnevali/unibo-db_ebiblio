import React from "react";

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        console.log("RESULT: ", this.props.data)
        const header = Object.keys(this.props.data[0]).map(key =>
        (<th class="font-semibold text-sm uppercase px-6 py-4">
            {key}
        </th>)
        )

        const values = this.props.data.map(x => {
            return (
                <tr>
                    {
                        Object.values(x).map(value => 
                            (
                                <td class="px-6 py-4" >
                                    <p class="">
                                        {value}
                                    </p>
                                </td >
                            )
                        )
                    }
                </tr>
            )
        });
        this.state = { header, values };
    }

    render() {
        return (
            <div class="flex items-center px-4">
                <div class='overflow-x-auto w-full'>
                    <table class='mx-auto max-w-4xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden'>
                        <thead class="bg-gray-50">
                            <tr class="text-gray-600 text-left">
                                {this.state.header}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            {this.state.values}
                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
}
