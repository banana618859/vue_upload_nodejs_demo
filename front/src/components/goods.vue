<!--
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2019-12-26 00:20:01
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-09-02 21:02:04
 -->
<template>
    <div>
        <h3 class="pageTitle">{{pageName}}
            <!-- <span style="color:red; font-size: 14px;">
                (提示：因为后台没有将数据保存数据库，若后台重启，数据会丢失！)</span> -->
        </h3>
        <div style="border:1px solid red; width:300px;">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </div>

        <div style="height:45px; line-height: 45px; padding:0 15px; text-align: left;">
            search:
            <el-input 
                v-model="keyWord"
                style="width:200px" size="mini"></el-input>
            <el-button type="success" size="mini" @click="searchGood">search</el-button>
            <el-button size="mini" type="primary" @click="showAddGoodsFun">新增商品1</el-button>
            
            <!-- <el-button size="mini" type="danger" @click="delMoreGoods">批量删除商品</el-button> -->
        </div>
        <el-table v-loading="tableLoading" element-loading-text="拼命加载中..." 
            :data="tableData" size="mini"
            style="width: 100%">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="_id" label="商品ID" width="150">
            </el-table-column>
            <el-table-column prop="goodImg" label="商品图片" width="120">
                <template slot-scope="scope">
                    <img :src="scope.row.goodImg" width="40px" />
                </template>
            </el-table-column>
            
            <el-table-column prop="name" label="商品名称" width="150">
            </el-table-column>
            <el-table-column prop="price" label="商品价格" width="150">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editGood(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="delGood(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="编辑商品" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
            <el-form :model="ruleForm" :rules="rules" size="mini" ref="ruleForm" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="商品名称" prop="name" required>
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品图片1" prop="goodImg" required>
                    <span class="goodImg">
                        <!-- <img :src="form.goodImg" width="50px" /> -->
                        <el-upload class="avatar-uploader" action="/aaa" :on-change="onchange"
                            :before-upload="beforeupload" :show-file-list="false" :on-success="handleAvatarSuccess">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </span>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input style="width: 80%;" v-model="ruleForm.price"></el-input>
                    <span> {{ruleForm.moneyType}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <span>
                    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                    <el-button type="primary" v-loading="editGoodLoad" @click="changeGood('ruleForm')" size="mini">确 定</el-button>
                </span>
            </div>
        </el-dialog>

        <el-dialog title="新增商品" :visible.sync="showAddGoods" width="35%">
            <el-form ref="form" size="mini" :model="addForm" label-width="80px">
                <el-form-item label="商品名称">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品图片1">
                    <span class="goodImg">
                        <!-- <img :src="form.goodImg" width="50px" /> -->
                        <el-upload class="avatar-uploader" action="/aaa" 
                            :on-change="onchange"
                            :before-upload="beforeupload" 
                            :show-file-list="false">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </span>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input style="width: 90%;" v-model="addForm.price"></el-input>
                    {{addForm.moneyType}}
                </el-form-item>
                
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showAddGoods = false" size="mini">取 消</el-button>
                <el-button type="primary" v-loading="addGoodLoad" @click="addGoods" size="mini">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
              data: [{
              id: 1,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                  id: 9,
                  label: '三级 1-1-1'
                }, {
                  id: 10,
                  label: '三级 1-1-2'
                }]
              }]
            }, {
              id: 2,
              label: '一级 2',
              children: [{
                id: 5,
                label: '二级 2-1'
              }, {
                id: 6,
                label: '二级 2-2'
              }]
            }, {
              id: 3,
              label: '一级 3',
              children: [{
                id: 7,
                label: '二级 3-1'
              }, {
                id: 8,
                label: '二级 3-2'
              }]
              }],
              defaultProps: {
                children: 'children',
                label: 'label'
              },
              keyWord: '',
              addGoodLoad: false,
              editGoodLoad: false,
              pageName: '商品管理页面',
              formData: new FormData(),
              imageUrl: '',
              tableLoading: false,
              dialogVisible: false,
              showAddGoods: false,
              dialogImageUrl: '',
              imgVisible: false,
              ruleForm: {
                  name: '',
                  goodImg: '',
                  goodKind: '',
                  note: '',
                  stock: 0,
                  online: false,
                  color: '',
                  stockColor: [],
                  baseColor: [],
                  price: 0,
                  historyPrice: 0,
                  moneyType: '元',
                  intro: '热卖商品'
              },
              rules: {
                  name: [
                      { required: true, message: '请输入商品名称', trigger: 'blur' },
                      { min: 1, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
                  ],
                  goodImg: [
                      { required: true, message: '请选上传图片', trigger: 'change' }
                  ],
                  goodKind: [
                      { required: true, message: '请选择商品种类', trigger: 'change' }
                  ]
              },
              demoImg: 'http://127.0.0.1:5000/public/images/goods/demo.png',
              newColor: '',
              addForm: {
                  name: '商品名称',
                  goodImg: 'http://127.0.0.1:5000/public/images/goods/demo.png',
                  price: 12,
              },
              tableData: []
            }
        },
        filters: {
            stringFilter(data) {
                console.log('data:', typeof data, data)
                let str = '';
                data.forEach(item => {
                    str += item + '/'
                })
                return str.slice(0, str.length - 1)
            }
        },
        mounted() {
            this.getGoodsList();
            // this.getGoodsCount();
        },
        methods: {
            searchGood(){
                console.log('商品id:',this.keyWord);
                this.keyWord = this.keyWord.trim()
                this.tableLoading = true;
                this.axios.post('/api/getOneGood',{'_id': this.keyWord})
                    .then(res => {
                        this.tableLoading = false;
                        console.log('--res:', res.data)
                        let rel = res.data;
                        if (rel.error > 0) {
                            this.$alert(rel.msg, '错误', {
                                type: 'error'
                            })
                        } else {
                            this.$message({
                                message: rel.msg,
                                type: 'success'
                            });
                            this.tableData =[]
                            this.tableData = JSON.parse(rel.data);
                            
                        }
                    })
                    .catch(error => {
                        console.log('error:', error);
                        this.tableLoading = false;
                        this.$alert('服务器发生故障！', '错误', {
                            type: 'error'
                        })
                    })
            },
            myMsy(text,theType){
                this.$message({
                    message: text,
                    type: theType
                })
            },
            addColor(theForm){
                console.log('--addColor');
                let hasOne=false;
                for(let i=0;i<theForm.baseColor.length;i++){
                    let one = theForm.baseColor[i];
                    if(one == this.newColor){
                        this.myMsy('不需要重复添加','warning');
                        theForm.stockColor.push(one);
                        hasOne=true;
                        break;
                    }
                }
                if(!hasOne){
                    console.log('新的颜色1');
                    theForm.baseColor.push(this.newColor);
                    theForm.stockColor.push(this.newColor)
                }
                this.newColor = ''
            },
            fatherkindChange(val) {
                console.log('goodKind', val);
                // this.addForm.goodKind = val
            },
            changeGoodsOnline(status) {
                console.log('--status:', status);
                this.axios.post('/changeGoodsOnline', { _id: status._id, online: status.online })
                    .then(res => {
                        console.log('res-rel-更新:', res)
                        let rel = res.data;
                        if (rel.error > 0)
                        {
                            this.$alert(rel.msg, '错误', {
                                type: 'error'
                            })
                        } else
                        {
                            this.$message({
                                message: rel.msg,
                                type: 'success'
                            });
                            this.editable = false;
                            let result = JSON.parse(rel.data);
                            result = result[0]
                            console.log('--rel:', result)
                            this.tableData.forEach((item, index) => {
                                if (item._id == result._id)
                                {
                                    this.tableData.splice(index, 1, result)
                                }
                            })
                        }
                    })
                    .catch(error => {
                        this.tableLoading = false;
                        console.log('err:', error)
                    })
            },
            // 阻止upload的自己上传，进行再操作
            beforeupload(file) {
                // 暂时，先将图片的对象存进file字段里面
                console.log('--beforeupload', file)
                this.formData.append('file', file)
                return false
            },
            handleAvatarSuccess(res, file) {
                console.log('--handleAvatarSuccess')
                // this.imageUrl = URL.createObjectURL(file.raw);
            },
            //预览图片：当上传图片后，调用onchange方法，获取图片本地路径
            onchange(file, fileList) {
                var _this = this;
                var event = event || window.event;
                var file = event.target.files[0];
                var reader = new FileReader();
                //转base64
                reader.onload = function (e) {
                    _this.imageUrl = e.target.result //将图片路径赋值给src
                    console.log('--_this.imageUrl:', _this.imageUrl)
                }
                reader.readAsDataURL(file);
                // 原文链接：https://blog.csdn.net/LONGLONGAGO_RU/article/details/83827758
            },
            changeGood(formName) {
                this.editGoodLoad=true;
                console.log('--changeGood:', formName)
                this.$refs[formName].validate((valid) => {
                    if (valid)
                    {
                        console.log('--changeGood', this.formData, this.form,this.ruleForm);
                        // 此处将所有的数据赋值给this.ruleFormData
                        this.formData.append('_id', this.ruleForm._id);
                        this.formData.append('name', this.ruleForm.name);
                        this.formData.append('price', this.ruleForm.price);
                        this.formData.append('goodImg', this.ruleForm.goodImg);
                        // this.formData.append('goodKind', this.ruleForm.goodKind);
                        // this.formData.append('id', this.ruleForm.id);
                        // this.formData.append('note', this.ruleForm.note);
                        // this.formData.append('online', this.ruleForm.online);
                        // this.formData.append('stock', this.ruleForm.stock);

                        
                        // this.formData.append('historyPrice', this.ruleForm.historyPrice);
                        // this.formData.append('moneyType', '元');

                        // // 颜色分类
                        // this.formData.append('color', '');
                        // this.formData.append('stockColor', this.ruleForm.stockColor);
                        // this.formData.append('baseColor', this.ruleForm.baseColor);

                        // this.formData.append('intro', this.ruleForm.intro);

                        console.log('--final-formData5:', this.formData.get("name"));
                        console.log('--final-formData25:', this.formData.get("file"));
                        this.axios.post('/api/updateGoods', this.formData)
                            .then(res => {
                                this.editGoodLoad=false;
                                this.dialogVisible = false;
                                // 更新完毕后，要将图片文件
                                this.formData=new FormData()
                                
                                console.log('res-rel-更新:', res)
                                let rel = res.data;
                                if (rel.error > 0){
                                    this.$alert(rel.msg, '错误', {
                                        type: 'error'
                                    })
                                } 
                                else{
                                    
                                    this.editable = false;
                                    console.log('up-data:',typeof rel.data,rel.data)
                                    let result = JSON.parse(rel.data);
                                    // result.goodKind = JSON.parse(result.goodKind)
                                    this.tableData.forEach((item, index) => {
                                        if (item._id == result._id)
                                        {
                                            console.log('更新数据--',item._id)
                                            this.tableData.splice(index, 1, result)
                                        }
                                    })
                                    this.$message({
                                        message: rel.msg,
                                        type: 'success'
                                    });
                                }
                            })
                            .catch(error => {
                                this.dialogVisible = false;
                                console.log('err:', error)
                            })
                    } else
                    {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            showAddGoodsFun() {
                console.log('--showAddGoodsFun')
                this.imageUrl = this.demoImg;
                this.showAddGoods = true;
            },
            addGoods() {
                this.addGoodLoad = true;
                console.log('--addGoods', this.formData, this.addForm);
                // 此处将所有的数据赋值给this.formData
                // this.formData.append('_id', this.addForm._id);
                this.formData.append('name', this.addForm.name);
                this.formData.append('price', this.addForm.price);
                this.formData.append('goodImg', this.addForm.goodImg);
                // return;
                console.log('--final-formData:', this.formData.get("name"));
                console.log('--final-formData2:', this.formData.get("file"));
                
                this.axios.post('/api/addGoods', this.formData)
                    .then(res => {
                        this.addGoodLoad = false;
                        this.showAddGoods = false;
                        // 更新完毕后，要将图片文件
                        this.formData=new FormData()       
                        console.log('res-rel-新增:', res)
                        let rel = res.data;
                        if (rel.error > 0)
                        {
                            this.$alert(rel.msg, '错误', {
                                type: 'error'
                            })
                        } else
                        {
                            this.$message({
                                message: rel.msg,
                                type: 'success'
                            });
                            this.editable = false;
                            let result = JSON.parse(rel.data);
                            //result = result[0]
                            console.log('-find-rel:', result)
                            this.tableData.unshift(result)
                        }
                    })
                    .catch(error => {
                        this.dialogVisible = false;
                        console.log('err:', error)
                    })
            },
            handleAvatarSuccess(res, file) {
                console.log('--file:', file)
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG)
                {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M)
                {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.imgVisible = true;
            },
            delMoreGoods() {
                console.log('--delMoreGoods')
            },
            getGoodsCount() {
                this.axios.get('/getGoodsCount')
                    .then(response => {
                        let res = response.data;
                        console.log("data--:", res);
                        this.$store.commit('changeGoodsLen', res.data.goodsLen)

                    })
                    .catch(error => {
                        console.log('err:', error)
                    })
            },
            getGoodsList() {
                this.tableLoading = true;
                console.log('--getGoodsList');
                this.axios.get('/api/getGoodsList')
                    .then(response => {
                        let res = response.data;
                        console.log("goods-data--:", res);

                        this.tableData = res;
                        setTimeout(() => {
                            this.tableLoading = false;
                        }, 1000)
                    })
                    .catch(error => {
                        console.log('err:', error)
                    })

            },
            onSubmit() {
                console.log('submit!');
            },
            editGood(row) {
                console.log('--editGood', row);
                this.dialogVisible = true;
                this.ruleForm = row;
                // this.ruleForm.goodKind = JSON.parse(this.ruleForm.goodKind)
                this.imageUrl = row.goodImg;
            },
            delGood(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                .then(() => {
                    this.tableLoading = true;
                    console.log('--delGood', row);
                    this.axios.post('/api/delGood', { _id: row._id })
                        .then(res => {
                            this.tableLoading = false;
                            console.log('res-rel-删除:', res)
                            let rel = res.data;
                            if (rel.error > 0)
                            {
                                this.$alert(rel.msg, '错误', {
                                    type: 'error'
                                })
                            } else
                            {
                                this.$message({
                                    message: rel.msg,
                                    type: 'success'
                                });
                                this.tableData.forEach((item, index) => {
                                    if (item._id == row._id)
                                    {
                                        this.tableData.splice(index, 1)
                                    }
                                })
                            }
                        })
                        .catch(() => {
                            this.tableLoading = false;
                        })
                }).catch(() => {
                    console.log('取消了')
                })
            },

            handleClose() {
                console.log('--handleClose');
                this.dialogVisible = false;
            }
        }
    }
</script>
<style scoped>
    .pageTitle{
        height: 30px;
        line-height: 30px;
        padding: 5px 10px; text-align: left;background-color: #eee;
    }
    /deep/ .el-dialog__body {
        padding: 0 20px;
    }

    .goodImg {
        float: left;
        display: block;
        border: 1px solid #eee;
        border-radius: 3px;
        width: 155px;
        height: 155px;
        padding: 3px;
        overflow: hidden;
    }

    /deep/ .el-upload-list--picture-card {
        vertical-align: unset;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
    }

    .avatar {
        width: 150px;
        height: 150px;
        display: block;
    }

    .w100 {
        width: 100%;
    }
</style>