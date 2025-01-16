const formatData = (data, pageNumber, totalPage) => {
    const result = {
        page:pageNumber,
        data,
        totalPage: totalPage,
    }
    return result;
}