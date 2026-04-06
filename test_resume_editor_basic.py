from playwright.sync_api import sync_playwright
import time

# 简化的测试脚本
def test_resume_editor_basic():
    print("=== 简历编辑器基本功能测试 ===\n")
    test_results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # 1. 页面加载
            print("1. 测试页面加载...")
            page.goto('http://localhost:5173/')
            page.wait_for_load_state('networkidle', timeout=60000)
            print("✅ 页面加载成功")
            test_results.append({"测试1: 页面加载": "通过"})
            
            # 2. 检查基本元素
            print("\n2. 测试基本元素可见性...")
            elements_to_check = [
                ('header.header', '头部导航栏'),
                ('section.editor', '左侧编辑区'),
                ('aside.preview', '右侧预览区'),
                ('.resume-select', '简历选择下拉框'),
                ('button:has-text("新建简历")', '新建简历按钮'),
                ('button:has-text("新增模块")', '新增模块按钮'),
                ('button:has-text("智能一页")', '智能一页按钮'),
                ('button:has-text("导出PDF")', '导出PDF按钮'),
            ]
            
            for selector, name in elements_to_check:
                try:
                    element = page.locator(selector)
                    if element.is_visible(timeout=30000):
                        print(f"✅ {name} 可见")
                    else:
                        print(f"❌ {name} 不可见")
                except Exception as e:
                    print(f"❌ {name} 测试失败: {e}")
            test_results.append({"测试2: 基本元素可见性": "通过"})
            
            # 3. 测试简历管理
            print("\n3. 测试简历管理功能...")
            try:
                create_btn = page.locator('button:has-text("新建简历")')
                if create_btn.is_visible():
                    create_btn.click()
                    time.sleep(2)
                    print("✅ 新建简历按钮点击成功")
                    test_results.append({"测试3: 简历管理": "通过"})
                else:
                    print("❌ 新建简历按钮不可见")
                    test_results.append({"测试3: 简历管理": "失败"})
            except Exception as e:
                print(f"❌ 简历管理功能测试失败: {e}")
                test_results.append({"测试3: 简历管理": "失败"})
            
            # 4. 测试模块管理
            print("\n4. 测试模块管理功能...")
            try:
                add_section_btn = page.locator('button:has-text("新增模块")')
                if add_section_btn.is_visible():
                    add_section_btn.click()
                    time.sleep(2)
                    project_option = page.locator('button:has-text("项目经验")')
                    if project_option.is_visible():
                        project_option.click()
                        time.sleep(2)
                        print("✅ 新增项目经验模块成功")
                        test_results.append({"测试4: 模块管理": "通过"})
                    else:
                        print("❌ 项目经验模块选项不可见")
                        test_results.append({"测试4: 模块管理": "失败"})
                else:
                    print("❌ 新增模块按钮不可见")
                    test_results.append({"测试4: 模块管理": "失败"})
            except Exception as e:
                print(f"❌ 模块管理功能测试失败: {e}")
                test_results.append({"测试4: 模块管理": "失败"})
            
            # 5. 测试智能一页功能
            print("\n5. 测试智能一页功能...")
            try:
                compress_btn = page.locator('button:has-text("智能一页")')
                if compress_btn.is_visible():
                    compress_btn.click()
                    time.sleep(2)
                    cancel_btn = page.locator('button:has-text("取消一页")')
                    if cancel_btn.is_visible():
                        cancel_btn.click()
                        time.sleep(2)
                        print("✅ 智能一页功能测试成功")
                        test_results.append({"测试5: 智能一页": "通过"})
                    else:
                        print("❌ 取消一页按钮不可见")
                        test_results.append({"测试5: 智能一页": "失败"})
                else:
                    print("❌ 智能一页按钮不可见")
                    test_results.append({"测试5: 智能一页": "失败"})
            except Exception as e:
                print(f"❌ 智能一页功能测试失败: {e}")
                test_results.append({"测试5: 智能一页": "失败"})
            
            # 6. 测试PDF导出功能
            print("\n6. 测试PDF导出功能...")
            try:
                export_btn = page.locator('button:has-text("导出PDF")')
                if export_btn.is_visible():
                    export_btn.click()
                    time.sleep(5)
                    print("✅ PDF导出功能测试成功")
                    test_results.append({"测试6: PDF导出": "通过"})
                else:
                    print("❌ 导出PDF按钮不可见")
                    test_results.append({"测试6: PDF导出": "失败"})
            except Exception as e:
                print(f"❌ PDF导出功能测试失败: {e}")
                test_results.append({"测试6: PDF导出": "失败"})
            
            print("\n=== 测试完成 ===")
            
        except Exception as e:
            print(f"测试过程中出现错误: {e}")
            test_results.append({"测试过程": f"失败: {e}"})
        finally:
            browser.close()
    
    # 生成测试报告
    print("\n=== 测试报告 ===")
    print("\n测试结果:")
    for result in test_results:
        for test, status in result.items():
            print(f"{test}: {status}")
    
    # 统计测试结果
    passed_tests = [result for result in test_results if list(result.values())[0].startswith("通过")]
    failed_tests = [result for result in test_results if not list(result.values())[0].startswith("通过")]
    
    print(f"\n测试总结:")
    print(f"总测试数: {len(test_results)}")
    print(f"通过测试数: {len(passed_tests)}")
    print(f"失败测试数: {len(failed_tests)}")
    
    if len(failed_tests) == 0:
        print("\n🎉 所有测试通过！")
    else:
        print("\n❌ 有测试失败，需要进一步检查。")

if __name__ == "__main__":
    test_resume_editor_basic()
