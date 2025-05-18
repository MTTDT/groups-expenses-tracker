import { useState } from "react"
import { Link } from "react-router-dom"

export default function GroupCard({group}:{group:Group}){

    return (
            <Link to={`/${group.id}`} className="no-underline text-inherit">
                <div className="h-44 w-32 sm:w-64 bg-gray-300 hover:bg-gray-400 cursor-pointer flex justify-center items-center rounded-lg transition-colors duration-200">
                    <p>{group.name}</p>
                </div>
            </Link>
    )
}