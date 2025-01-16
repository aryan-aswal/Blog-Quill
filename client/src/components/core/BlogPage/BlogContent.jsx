import React from 'react'
import { Link } from 'react-router-dom'

const Img = ({ src, caption }) => {
    return (
        <div>
            <img src={src} />
            {
                caption && <p className='w-full text-center my-3 md:mb-12 text-base text-dark-grey'>{caption}</p>
            }
        </div>
    )

}
const Quote = ({ text, caption }) => {
    return (
        <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
            <p className='text-xl leading-10 md:text-2xl'>{text}</p>
            {
                caption && <p className='w-full text-purple text-base'>{caption}</p>
            }
        </div>
    )
}

const List = ({ style, items }) => {
    return (
        <ol className={`pl-5 ${style == 'ordered' ? "list-decimal" : "list-disc"}`}>
            {
                items.map((item, index) => {
                    return <li key={index} className='my-4' dangerouslySetInnerHTML={{ __html: item }}></li>
                })
            }
        </ol>
    )
}

const Table = ({ content }) => {
    return (
        <table className='w-full'>
            {
                content.map((row, index) => (
                    <tbody key={index} >
                        <tr>
                            {
                                row.map((cell, index) => (
                                    <td
                                        key={index}
                                        dangerouslySetInnerHTML={{ __html: cell }}
                                        className='p-2 border border-grey text-center text-base'
                                    ></td>
                                ))
                            }
                        </tr>
                    </tbody>
                ))
            }
        </table>
    )
}

const LinkTool = ({ data }) => {
    console.log(data);
    return (
        <Link
            to={data.link}
            target="_blank"
            style={{ textDecoration: 'none'}}
        >
            <div className="flex items-center border border-grey rounded-lg bg-white text-black p-6">
                <div className="flex flex-col">
                    <p className="font-bold">{data.meta.title}</p>
                    <p className="text-xl leading-tight mt-1 mb-1">{data.meta.description}</p>

                    <div>
                        <p className='text-dark-grey text-base'>{data.link.split('/')[2]}</p>
                    </div>
                </div>
                

                <div className="flex-shrink-0 w-20 h-20 overflow-hidden">
                    <img
                        src={data.meta.image.url}
                        alt={data.meta.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </Link>
    );
};

const Code = ({code}) => {
    return (
        <p 
            style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
            className='bg-[#F8F7FA] border border-[#6C63FF] p-5 text-sm leading-5 rounded-md'
        >{code}</p>
    )
}

const Raw = ({html}) => {
    return (
        <p 
            style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
            className='bg-[#1E2128] text-[#9CA3AF] text-sm leading-5 p-5 rounded-md'
        >{html}</p>
    )
}
const BlogContent = ({ block }) => {

    if (block.type === 'paragraph') {
        return <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
    }
    if (block.type === 'header') {
        if (block.data.level === 1) return <h1 dangerouslySetInnerHTML={{ __html: block.data.text }}></h1>
        if (block.data.level === 2) return <h2 dangerouslySetInnerHTML={{ __html: block.data.text }}></h2>
        if (block.data.level === 3) return <h3 dangerouslySetInnerHTML={{ __html: block.data.text }}></h3>
        if (block.data.level === 4) return <h4 dangerouslySetInnerHTML={{ __html: block.data.text }}></h4>
        if (block.data.level === 5) return <h5 dangerouslySetInnerHTML={{ __html: block.data.text }}></h5>
        if (block.data.level === 6) return <h6 dangerouslySetInnerHTML={{ __html: block.data.text }}></h6>
    }
    if (block.type === 'image') {
        return <Img src={block.data.file.url} caption={block.data.caption} />
    }
    if (block.type === 'quote') {
        return <Quote text={block.data.text} caption={block.data.caption} />
    }
    if (block.type === 'list') {
        return <List style={block.data.style} items={block.data.items} />
    }

    if (block.type === 'table') {
        return <Table content={block.data.content} />
    }

    if (block.type === 'linkTool') {
        return <LinkTool data={block.data} />
    }

    if(block.type === 'code') {
        return <Code code={block.data.code}/>
    }

    if(block.type === 'raw') {
        console.log(block);
        return <Raw html={block.data.html}/>
    }
}

export default BlogContent