<template>
  <div class="successSignup">
    <div class="successSignupDiv">
      <img src="@/assets/dobby.png" alt="" />
      <h4>DOBBY 고용을 진심으로</h4>
      <h3>
        <span style="color: rgb(255, 155, 155)">♥</span>
        <span>감</span>
        <span>사</span>
        <span>드</span>
        <span>립</span>
        <span>니</span>
        <span>다</span>
        <span style="color: rgb(255, 155, 155)">♥</span>
      </h3>
      <router-link to="/"
        ><button class="toLogin">로그인하고 DOBBY 만나기</button></router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'successSignup',
}
</script>

<style>
.successSignupDiv {
  width: 100%;
  min-width: 270px;
  max-width: 700px;
  margin: 0 auto;
  font-size: 120%;
}

.successSignupDiv h4 {
  margin-top: 5%;
}

.successSignupDiv img {
  width: 50%;
}

.successSignupDiv span {
  animation: bounce 0.5s ease infinite alternate;
}

.successSignupDiv span:nth-child(2) {
  animation-delay: 0.1s;
}
.successSignupDiv span:nth-child(3) {
  animation-delay: 0.2s;
}
.successSignupDiv span:nth-child(4) {
  animation-delay: 0.3s;
}
.successSignupDiv span:nth-child(5) {
  animation-delay: 0.4s;
}
.successSignupDiv span:nth-child(6) {
  animation-delay: 0.5s;
}
.successSignupDiv span:nth-child(7) {
  animation-delay: 0.6s;
}
.successSignupDiv span:nth-child(8) {
  animation-delay: 0.7s;
}

.toLogin {
  width: 70%;
  height: 35px;
  margin-top: 5%;
  border: none;
  border-radius: 2px;
  background-color: #a9c9de;
  font-family: 'Gowun Batang', serif !important;
  color: white;
}

.toLogin:hover {
  box-shadow: 0 0 5px #a9c9de;
}

@keyframes bounce {
  100% {
    top: -20px;
    text-shadow: 2px 2px 2px rgb(255, 186, 186);
  }
}
</style>
