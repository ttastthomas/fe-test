import Image from 'next/image'
import { InferGetStaticPropsType, GetStaticProps } from 'next'
import React from 'react';
import ReactDOM from 'react-dom';

export const getStaticProps = async () => {
    const res = await fetch('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product')
    const product = await res.json()
    return { props: { product } }
}

function SelectSize({ sizes, handleOn }) {
    return (
        sizes.map((size, index) => {
            return (
                <label key={size.label}>
                    <input class="sr-only peer" name="size" type="radio" value={size.label} onClick={handleOn(size.label)} />
                    <div class="w-9 h-9 border-2 rounded-none border-slate-200 flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:border-slate-950">
                        {size.label}
                    </div>
                </label>
            );
        })
    )
}

export default function Page({ product }) {
    const [selectedSize, setSize] = React.useState("S");

    function handleClick(size) {
        console.log(size);
        setSize(size);
    }

    function submit() {
        console.log("hello");
    }

    return (
        <div class="font-sans font">
            <nav class="flex items-center justify-between flex-wrap header-bg p-6">
                <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto justify-end">
                    <div>
                        <a href="#" class="inline-block text-sm px-4 py-2 leading-none text-gray-400 hover: mt-4 lg:mt-0">My Cart</a>
                    </div>
                </div>
            </nav>
            <div class="flex">
                <div class="flex-none w-48 relative">
                    <Image width="500" height="500" src="/classic-tee.jpg" alt="" class=" inset-0 w-full h-full object-cover" />
                </div>
                <form class="flex-auto p-6">
                    <div class="flex flex-col">
                        <h1 class="flex-auto text-2xl black22 border-slate-200 border-b">
                            {product.title}
                        </h1>
                        <h2 class="text-sm font-bold black22 border-b border-slate-200">
                            {`$ ${Number.parseFloat(product.price).toFixed(2)}`}
                        </h2>
                        <div class="w-full flex-none text-sm grey mt-2">
                            {product.description}
                        </div>

                    </div>
                    <div class="flex">
                        SIZE<p class="red-ast">*</p> <p>{selectedSize}</p>
                    </div>
                    <div class="flex items-baseline mt-4 mb-6 pb-6">
                        <div class="space-x-2 flex text-sm">
                            <SelectSize sizes={product.sizeOptions} handleOn={handleClick} />
                        </div>
                    </div>
                    <div class="flex space-x-4 mb-6 text-sm font-medium">
                        <div class="flex-auto flex space-x-4">
                            <button class="h-10 px-6 font-semibold border border-slate-900 border-2 text-slate-900" type="button" onClick={submit}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};