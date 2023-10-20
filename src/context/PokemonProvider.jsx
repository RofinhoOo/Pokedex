import { useEffect, useState } from "react"
import { useForm } from "../hook/UseForm"
import { PokemonContext } from "./PokemonContext"

export const PokemonProvider = ({children}) => {

    const [allpokemons, setAllPokemons] = useState([]);
    const [globalpokemons, setGlobalPokemons] = useState([]);
    const [offset, setOffset] = useState(0);

    // CUSTOMHOOK USEFORM
    const { valueSearch, onInputChange, onResetForm } = useForm({
        valueSearch: ''
    })

    // ESTADOS SIMPLES
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(false);


    // Llamar a los 50 primeros pokemons
    const getAllPokemons = async (limit = 50) => {
        const url = 'https://pokeapi.co/api/v2/'

        const res = await fetch(`${url}pokemon?limit=${limit}&offset=${offset}`);

        const data = await res.json()
        
        const promises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url)
            const data = await res.json()
            return data;
        })

        const results = await Promise.all(promises)
        setAllPokemons([...allpokemons, ...results]);
        setLoading(false)
    }

    // Llamar a todos los pokemons
    const getGlobalPokemons = async () => {
        const url = 'https://pokeapi.co/api/v2/'

        const res = await fetch(`${url}pokemon?limit=100000&offset=0`)
        const data = await res.json()
        
        const promises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url)
            const data = await res.json()
            return data;
        })

        const results = await Promise.all(promises)
        setGlobalPokemons(results)
        setLoading(false)
    }

    //LLAMAR POKEMON POR ID
    const getPokemonById = async (id) => {
        const url = 'https://pokeapi.co/api/v2/'
        const res = await fetch(`${url}pokemon/${id}`)
        const data = await res.json()
        return data;
    }


    useEffect(() => {
        getAllPokemons()
    }, [])

    useEffect(() => {
        getGlobalPokemons()
    }, [])

  return (
    <PokemonContext.Provider value={{
        valueSearch,
        onInputChange,
        onResetForm
    }}>
        {children}
    </PokemonContext.Provider>
  )
}
