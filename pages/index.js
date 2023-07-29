import Image from 'next/image'
import React,{ useRef } from 'react';
import { Popover, Transition, Fragment } from '@headlessui/react'

export const getStaticProps = async () => {
    const res = await fetch('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product')
    const product = await res.json()
    return { props: { product } }
}

function SelectSize({ sizes, handleOn }) {
    return (
        sizes.map((size) => {
            return (
                <label key={size.label}>
                    <input class="sr-only peer" name="size" type="radio" value={size.label} onClick={() => handleOn(size.label)} />
                    <div class="w-9 h-9 border-2 rounded-none border-slate-200 flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:border-slate-950">
                        {size.label}
                    </div>
                </label>
            );
        })
    )
}

function CartPreview({ className, labelText, itemDetails }) {
    const timeoutDuration = 120
    const triggerRef = useRef()
    const timeOutRef = useRef()

    const handleEnter = (isOpen) => {
        clearTimeout(timeOutRef.current)
        !isOpen && triggerRef.current?.click()
    }

    const handleLeave = (isOpen) => {
        timeOutRef.current = setTimeout(() => {
            isOpen && triggerRef.current?.click()
        }, timeoutDuration)
    }

    return (
        <Popover className={className}>
            {({ open }) => (
                <div
                    onMouseEnter={() => handleEnter(open)}
                    onMouseLeave={() => handleLeave(open)}
                >
                    <Popover.Button ref={triggerRef} >
                        {labelText} ({itemDetails?.length ?? 0})
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute left-1/2 z-50 mt-3 -translate-x-1/2 transform px-4">
                        {itemDetails.map((item) =>
                            <a
                            key={item.name}
                            href="#"
                            className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                              <item.pic aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.price}
                              </p>
                            </div>
                          </a>
                        )}
                        </Popover.Panel>
                    </Transition>
                </div>
            )
            }
        </Popover>
    )
}

export default function Page({ product }) {
    const [selectedSize, setSize] = React.useState("S");
    const [cart, addToCart] = React.useState([]);

    function handleClick(size) {
        console.log(size);
        setSize(size);
    }

    function submit() {
        let t = [
            ...cart,
            {pic: "/classic-tee.jpg", name: product.title, price: product.price, size: selectedSize}
        ];
        addToCart(t);
    }

    return (
        <div class="font-sans font">
            <nav class="flex items-center justify-between flex-wrap header-bg p-6">
                <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto justify-end">
                    <div>
                        <CartPreview labelText="My Cart" itemDetails={cart} />
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