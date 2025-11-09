import {createSlice,createAsyncThunk}from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchProductsByFilter = createAsyncThunk(
  "products/fetchByFilter",
  async ({
    category,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    collection,
    materials,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();

    if (category) query.append('category', category);
    if (size) query.append('size', size);
    if (color) query.append('color', color);
    if (gender) query.append('gender', gender);
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (sortBy) query.append('sortBy', sortBy);
    if (search) query.append('search', search);
    if (materials) query.append('materials', materials);
    if (brand) query.append('brand', brand);
    if (limit) query.append('limit', limit);

    // Only add collection if not empty and not "all"
    if (collection && collection !== "all") query.append('collection', collection);

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`;
    console.log('Fetching products with URL:', url);

    const response = await axios.get(url);
    return response.data;
  }
);
//asyn thunk to fetch product details by id
export const fetchProductDetails=createAsyncThunk("products/fetchDetails",async(id)=>{
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
    return response.data;
});

//async thunk to fetch update product by id

export const updateProduct=createAsyncThunk("products/updateProduct", async({id,productData,})=>{
    const response=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,productData,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('usertoken')}`,
        },
    });
    return response.data;
});


// async thunk to fetch similar products

export const fetchSimilarProducts=createAsyncThunk("products/fetchSimilar",async({id})=>{
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`); 
    return response.data;
});

const productsSlice=createSlice({
    name:'products',
    initialState:{
        products:[],
        selectProduct:null,
        similarProducts:[],
        loading:false,
        error:null,
        filters:{
            category:"",
            size:"",
            color:"",
            gender:"",
            minPrice:"",
            maxPrice:"",
            sortBy:"",
            search:"",
            collection:"",
            materials:"",
            brand:"",
        },
    },
    reducers:{
        setFilters:(state,action)=>{
            state.filters={...state.filters,...action.payload};
        },
        clearFilters:(state)=>{
            state.filters={
                 category:"",
            size:"",
            color:"",
            gender:"",
            minPrice:"",
            maxPrice:"",
            sortBy:"",
            search:"",
            collection:"",
            materials:"",
            brand:"",

            };
        },
},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchProductsByFilter.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchProductsByFilter.fulfilled,(state,action)=>{
                state.loading=false;
                state.products=Array.isArray(action.payload)?action.payload:[];
            })
            .addCase(fetchProductsByFilter.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.error.message;
            })
            .addCase(fetchProductDetails.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchProductDetails.fulfilled,(state,action)=>{
                state.loading=false;
                state.selectProduct=action.payload;
            })
            .addCase(fetchProductDetails.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.error.message;
            })
            .addCase(updateProduct.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(updateProduct.fulfilled,(state,action)=>{
                state.loading=false;
                const updatedProduct=action.payload;
                const index=state.products.findIndex((product)=> product._id===updatedProduct._id);
                if(index!==-1){
                    state.products[index]=updatedProduct;
                }
            })
            .addCase(updateProduct.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.error.message;
            })
            .addCase(fetchSimilarProducts.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchSimilarProducts.fulfilled,(state,action)=>{
                state.loading=false;
                state.similarProducts=action.payload;
            })
            .addCase(fetchSimilarProducts.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.error.message;
            });
    }

});

export const {setFilters,clearFilters}=productsSlice.actions;
export default productsSlice.reducer;
