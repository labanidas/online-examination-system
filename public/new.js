// dropdown menu event listeners
document.querySelector('.dropdown').addEventListener('click', () => {
    document.querySelector('.dropdown-menu').style.transition =" all 0.5s ease";
});

document.querySelector('.dropdown-menu').addEventListener('click',repl);
function repl(e)
{
    let i = e.target;
    document.querySelector('.select-btn').innerHTML= i.innerHTML;
}

// load registration page
// document.querySelector('.register-btn').addEventListener('click',()=>{

// document.querySelector('.form').innerHTML=`
// <h2>Register to build your own account!</h2>
//                   <br >
//                   <div class="dropdown">
//                     <button
//                       class="btn btn-light dropdown-toggle select-btn"
//                       type="button"
//                       id="dropdownMenuButton1"
//                       data-bs-toggle="dropdown"
//                       aria-expanded="false"
//                     >
//                       Select category
//                     </button>
//                     <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
//                       <li><a class="dropdown-item" href="#">Admin</a></li>
//                       <li><a class="dropdown-item" href="#">Teacher</a></li>
//                       <li><a class="dropdown-item" href="#">Student</a></li>
//                     </ul>
//                   </div>
//                   <input type="text" name="fname" placeholder="Your First Name">
//                   <input type="text" name="lname" placeholder="Your Last Name">
//                   <input type="text" onclick="this.type='date'" onblur="this.type='text'" placeholder="Your Date of Birth   :" name="dob">
//                   <input type="email" name="email" placeholder="Your Email id">
//                   <input type="text" name="ph" placeholder="Your Phone no. ">
                    
//                   <input type="text" placeholder=" Your Registration Number" name="reg-no" >
//                   <input type="password" placeholder="Type your password" name="password">
//                   <button class="btn btn-primary btn-lg">Register</button>
// `;

// });

// //load login page
// document.querySelector('.login-btn').addEventListener('click',()=>{

// });