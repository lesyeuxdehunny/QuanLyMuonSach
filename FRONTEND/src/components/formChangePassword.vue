<template>
    <div class="form-overlay">
        <div class="form-container">
            <h3>Đổi Mật Khẩu</h3>

            <label for="matkhau">Mật Khẩu Cũ</label>
            <input id="matkhau" v-model="confirmOldPass" />
            <p v-if="errorMessageMKC" style="color: red;">{{ errorMessageMKC }}</p>

            <label for="matkhaumoi">Mật Khẩu Mới</label>
            <input id="matkhaumoi" v-model="newpass" />

            <label for="matkhaumoi1">Nhập lại Mật Khẩu Mới</label>
            <input id="matkhaumoi1" v-model="confirmNewPass" />
            <p v-if="errorMessageMKM" style="color: red;">{{ errorMessageMKM }}</p>

            <button @click="submitForm" class="submit">Lưu</button>
            <button @click="$emit('close')" class="cancel">Hủy</button>
        </div>
    </div>
</template>

<script>

export default {
    props: ["reader"],
    data() {
        return {
            editUser: { ...this.reader },
            errorMessageMKM: "",
            errorMessageMKC: "",
            newpass: "",
            confirmNewPass: "",
            confirmOldPass: "",
        };
    },
    methods: {
        submitForm() {
            // this.$emit("changePassword", this.editUser);
            // this.errorMessage = "";
            this.ChangePass();
        },
        async ChangePass() {
            this.errorMessageNKC = "";
            this.errorMessageMKM = "";

            if (this.editUser.pass === this.confirmOldPass) {
                if (this.confirmNewPass === this.newpass && this.newpass !== "") {
                    this.editUser.pass = this.newpass;
                    this.$emit("changePassword", this.editUser);
                }
                else {
                    this.errorMessageMKM = "Mật khẩu mới không khớp"
                }
            }
            else {
                this.errorMessageMKC = "Mật khẩu sai"
            }
        }
    },
    watch: {
        reader(newUser) {
            this.editUser = { ...newUser };
        }
    },
};
</script>

<style scoped>
.form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-container {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
}

label {
    display: block;
    font-weight: bold;
    text-align: left;
    margin: 10px 0px 0px 0px;
}

input,
select {
    width: 100%;
    margin: 2px 0 0 0;
    padding: 3px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

button {
    padding: 8px 15px;
    margin: 5px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.cancel {
    background-color: red;
    color: white;
}

.submit {
    background-color: green;
    color: white;
}
</style>
