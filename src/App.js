// Starter code for the front-end, includes examples of accessing all server 
// API routes with AJAX requests.
// StAuth10244: I Van Ben Pham, 000872024 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

import './App.css';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Table, Input } from '@mui/material';
import Header from './BasicComponents/Header';
import Footer from './BasicComponents/Footer';
import { Routes, Route, Router, NavLink, Link, useParams, Outlet } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Label } from '@mui/icons-material';

// Material UI is included in the install of the front end, so we have access
// to components like Buttons, etc, when we import them.

/**
 * Nav bar components
 * @param none
 * @returns nav bar
 */

function Nav() {
  return(
    <div>
      <nav class="navbar navbar-expand-lg navbar-light" >
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item active nav-link">
              <NavLink to="/" style={{ textDecoration: 'none' }}>Home</NavLink>
            </li>
            <li class="nav-item nav-link">
              <NavLink to="/inventory" style={{ textDecoration: 'none' }}>Inventory</NavLink>
            </li>
            <li class="nav-item nav-link">
             <NavLink to="/search" style={{ textDecoration: 'none' }}>Search</NavLink>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Other
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item"><Link to="/other/soa" style={{ textDecoration: 'none' }}>SOA</Link></a>
                <a class="dropdown-item"><Link to="/other/about" style={{ textDecoration: 'none' }}>About</Link></a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="inventory" element={<Inventory />}></Route>
        <Route path="search" element={<Search />}></Route>
        <Route path="other">
          <Route path="soa" element={<Soa/>}/>
          <Route path="about" element={<About/>}/>
        </Route>
      </Routes>
    
      </div>
  );
}


/**
 * Home component
 * @param none
 * @returns Background image
 */
function Home() {
  return (
    <div  style={{margin:'20px',textAlign:'center'}}>
      <img src="../images/background.jpg" alt="background image" width="30%" height="40%"/>
    </div>
  );
}

/**
 * Soa component
 * @param none
 * @returns Statement of authorship image
 */
function Soa() {
  return(
    <p style={{margin:'20px'}}>
      StAuth10244: I Van Ben Pham, 000872024 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
    </p>
  );
}

/**
 * About component
 * @param none
 * @returns Introduction about store
 */
function About() {
  return (
    <p  style={{margin:'20px'}}>
      Little Friends is one of the best pet store in the cities, which was founded by a group of people who really love pets in 2010. At Little Friends, you can easily find rarest pieces which are hard to find elsewhere in the area.
    </p>
  );
}

/**
 * Search component
 * @param none
 * @returns Input field for entering search word. Results formatted as a table
 */
function Search() {
  const[searchStr, setSearchStr] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoaded2, setIsLoaded2] = useState(false);

  useEffect(() => {
    searchPet()
  }, []);

  // Searches for pets in the pet inventory.  Again we use hardcoded data but
  // we could build a custom fetch URL string.
  const searchPet = () =>
  {
    var url = "http://localhost:3001/api?act=search&term=%" + searchStr + "%";
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        setIsLoaded2(true);
        setSearchResults(result);
      });
  }

    if (!isLoaded2) {
      return <div>Loading...</div>;
    } 
    else {
      return (
        <div>
        <h2>Search Pets</h2>
        <div style={{ textAlign: 'center' }}>
          <Input type="text" value={searchStr} name="searchStr" onChange={event => setSearchStr(event.target.value)} placeholder="Type here"/>
          <Button variant="contained" onClick={()=>searchPet()} >Search Pets for "friendly with"</Button>
        </div>
        <br />
          <Table>
              <thead>
              <tr>
                <th>Animal</th>
                <th>Description</th>
                <th>Age</th>
                <th>Price</th>
              </tr>
              </thead>
              <tbody>
                {searchResults.map(pet => 
                (
                  <tr key={pet.id}>
                    <td>{pet.animal}</td> 
                    <td>{pet.description}</td>
                    <td>{pet.age}</td>
                    <td>{pet.price}</td>
                  </tr>
                )
                )}
              </tbody>
            </Table>
        </div>
      )
    } 
}

  
/**
 * Inventory component
 * @param none
 * @returns List of pets formatted as a table. Updating, Deleting and Adding function
 */
function Inventory() {
  
  // isLoaded keeps track of whether the initial load of pet data from the
  // server has occurred.  pets is the array of pets data in the table, and 
  // searchResults is the array of pets data after a search request.
  const [isLoaded, setIsLoaded] = useState(false);
  const [pets, setPets] = useState([]);
  const [animal, setAnimal] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [price, setPrice] = useState(0);
  const [validInput, setValidInput] = useState("Invalid Input!");
  const [addForm, setAddForm] = useState(false);
  const [updateForm, setUpdateForm] = useState([]);
  const [heading, setHeading] = useState("Pets List");

  
  // fetches all pet data from the server
  function fetchPets()
  {
    fetch("http://localhost:3001/api?act=getall")
    .then(res => res.json())
    .then(
      (result) => {
        setIsLoaded(true);
        setPets(result);
      });

    //console.log(pets.length)
    
    if(updateForm.length  == 0 || updateForm === undefined) {
      let newUpdateForms = [];
      for(let i = 0; i < pets.length; i++) {
        newUpdateForms.push(false);
      }
      setUpdateForm(newUpdateForms);
    }
  }

  
  // use fetchPets as an effect with an empty array as a 2nd argument, which 
  // means fetchPets will ONLY be called when the component first mounts
  useEffect(fetchPets, []);
  
  // // Inserts a pet with hardcoded data in the URL for each query parameter, we 
  // // could insert a pet with custom data by building a string
  function addPet() {
      // let addForms = [];
      // for(let i = 0; i < updateForm.length; i++) {
      //   addForms.push(false);
      //   console.log(addForms[i]);
      // }
      // setUpdateForm(addForms);
      if(updateForm.length  == 0 || updateForm === undefined) {
        fetchPets()
        let newUpdateForms = [];
        for(let i = 0; i < pets.length; i++) {
          newUpdateForms.push(false);
        }
        setUpdateForm(newUpdateForms);
      }
      if(animal != "" && description !="" && age != ""){
        if(pets.length == updateForm.length) {
          let newUpdateForms = updateForm;
          newUpdateForms.push(false);
          setUpdateForm(newUpdateForms);
        }
        else {
          let newUpdateForms = updateForm;
          newUpdateForms[pets[pets.length-1].id] = false;
          setUpdateForm(newUpdateForms);
        }
        

        setValidInput("New Pet Added Successfully!");
        var url = "http://localhost:3001/api?act=add&animal="+animal+"&description="+description+"&age="+age+"&price=" + price;
        fetch(url)
        .then(res => res.json())
        .then((result) => {fetchPets();
        });
        setAge("");
        setDescription("");
        setPrice(0);
        setAnimal("");
        
      }
      else {
        setValidInput("Invalid Input!");
        console.log("no");
      }

     
  }


  // Deletes a pet from the pet inventory, using a hardcoded id query parameter
  // Again we could delete a pet with custom data by building a string like:
  //
  // let url = "http://localhost:3001/api?act=delete&id=" + id
  //
  // fetch(url)
  // .then( ... )...
  //
  // 
  function deletePet(petId)
  {
    var url = "http://localhost:3001/api?act=delete&id=" + petId;
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        fetchPets();
      });
      
    
  }

  // Updates a pet in the pet inventory.  Again we use hardcoded data but 
  // could build a custom fetch URL string.
  function updatePet(pet)
  {
    setAddForm(false);
    if(animal == "") {
      setAnimal(pet.animal);
      console.log(animal);
    }

    if(description == "") {
      setDescription(pet.description);
    }

    if(age == "") {
      setAge(pet.age);
    }

    if(!updateForm[pet.id]) {
      var url = "http://localhost:3001/api?act=update&id="+pet.id+"&animal="+animal+"&description="+description+"&age="+age+"&price=" + price;
      fetch(url)
      .then(res => res.json())
      .then((result) => {fetchPets();
      });

    }
    
    if(updateForm.length  == 0 || updateForm === undefined) {
      fetchPets()
      let newUpdateForms = [];
      for(let i = 0; i < pets.length; i++) {
        newUpdateForms.push(false);
      }
      newUpdateForms[pet.id - 1] = !newUpdateForms[pet.id - 1];
      setUpdateForm(newUpdateForms);
      console.log("set update")
    }

    let newUpdateForms = [];
    newUpdateForms = updateForm;
    newUpdateForms[pet.id - 1] = !newUpdateForms[pet.id - 1];
    setUpdateForm(newUpdateForms);
  }  
  

  // If data has loaded, render the table of pets, buttons that execute the 
  // above functions when they are clicked, and a table for search results. 
  // Notice how we can use Material UI components like Button if we import 
  // them as above.
  //
  if (!isLoaded) {
    return <div>Loading...</div>;
  } 
  else {
    if(addForm) {   //If statement to show addForm
      return (
        <div>
          <h2>{heading}</h2>
          <Table>
            <tbody>
            <tr>
              <th>Animal</th>
              <th>Description</th>
              <th>Age</th>
              <th>Price</th>
              <th></th>
            </tr>
            {pets.map(pet => updateForm[pet.id - 1] ? (   //Using inline if statement to show update input field
              <tr key={pet.id}>
                <td><Input name="animal" placeholder={pet.animal} onChange={event => setAnimal(event.target.value)} type="text" value={animal}/></td> 
                <td><Input name="description" type="text" value={description} placeholder={pet.description} onChange={event => setDescription(event.target.value)}/></td>
                <td><Input name="age" type="text" placeholder={pet.age} value={age} onChange={event => setAge(event.target.value)}/></td>
                <td><Input name="price" type="text" placeholder={pet.price} value={price} onChange={event => setPrice(event.target.value)} /></td>
                <td>
                  <Button variant="contained" onClick={() => deletePet(pet.id)}>Click to Delete</Button>
                  <Button variant="contained" onClick={() =>{updatePet(pet); setHeading("Pets List")}}>Save</Button>
                </td>
              </tr>
            ):
            (
              <tr key={pet.id}>
                <td>{pet.animal}</td> 
                <td>{pet.description}</td>
                <td>{pet.age}</td>
                <td>{pet.price}</td>
                <td>
                  <Button variant="contained" onClick={() => deletePet(pet.id)}>Click to Delete</Button>
                  <Button variant="contained" onClick={() => {updatePet(pet); setHeading("Updating " + pet.animal);}}>Update</Button>
                </td>
              </tr>
            )
            )}
            </tbody>
          </Table>
          <br />
          <Button variant="contained" onClick={()=>addForm ? setAddForm(false) : setAddForm(true)}>Add New Pet</Button>
          <div>
            <Label for="animal">Animal</Label>
            <Input id="animal" name="animal" value={animal} onChange={event => setAnimal(event.target.value)} type="text" placeholder="Dog"/>
            <Label for="description">Description</Label>
            <Input id="description" value={description} onChange={event => setDescription(event.target.value)} name="description" type="text" placeholder="Breed, weight, height, color"/>
            <Label for="age">Age</Label>
            <Input id="age" name="age" value={age} onChange={event => setAge(event.target.value)} type="text" placeholder="2 months"/>
            <Label for="price">Price</Label>
            <Input id="price" name="price" value={price} onChange={event => setPrice(event.target.value)} type="text" placeholder="weight, height, color"/>
            <Button onClick={() => {addPet();}}>Submit</Button>
            <p>{validInput}</p>
          </div>

        </div>
      );
    }
    else {
      return (
        <div>
          <h2>{heading}</h2>
          <Table>
            <tbody>
            <tr>
              <th>Animal</th>
              <th>Description</th>
              <th>Age</th>
              <th>Price</th>
              <th></th>
            </tr>
            {pets.map(pet => updateForm[pet.id - 1] ? (   //Using inline if statement to show update input field
              <tr key={pet.id}>
                <td><Input name="animal" placeholder={pet.animal} onChange={event => setAnimal(event.target.value)} type="text" value={animal}/></td> 
                <td><Input name="description" type="text" value={description} placeholder={pet.description} onChange={event => setDescription(event.target.value)}/></td>
                <td><Input name="age" type="text" placeholder={pet.age} value={age} onChange={event => setAge(event.target.value)}/></td>
                <td><Input name="price" type="text" placeholder={pet.price} value={price} onChange={event => setPrice(event.target.value)} /></td>
                <td>
                  <Button variant="contained" onClick={() => deletePet(pet.id)}>Click to Delete</Button>
                  <Button variant="contained" onClick={() => {updatePet(pet); setHeading("Pets List")}}>Save</Button>
                </td>
              </tr>
            ):
            (
              <tr key={pet.id}>
                <td>{pet.animal}</td> 
                <td>{pet.description}</td>
                <td>{pet.age}</td>
                <td>{pet.price}</td>
                <td>
                  <Button variant="contained" onClick={() => deletePet(pet.id)}>Click to Delete</Button>
                  <Button variant="contained" onClick={() => {updatePet(pet); setHeading("Updating " + pet.animal);}}>Update</Button>
                </td>
              </tr>
            )
            )}
            </tbody>
          </Table>
          <br />
          <Button variant="contained" onClick={()=>{addForm ? setAddForm(false) : setAddForm(true)}}>Add New Pet</Button>
        </div>
      );
    }
  }
}

function App() {
  return (
    <div>
      <BrowserRouter>
      <Header />
      <Nav />
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
