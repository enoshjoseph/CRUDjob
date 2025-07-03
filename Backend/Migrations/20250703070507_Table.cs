using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobRequests_Departments_DepartmentId",
                table: "JobRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_JobRequests_Users_RequestedBy",
                table: "JobRequests");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_JobRequests_DepartmentId",
                table: "JobRequests");

            migrationBuilder.DropIndex(
                name: "IX_JobRequests_RequestedBy",
                table: "JobRequests");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "JobRequests");

            migrationBuilder.DropColumn(
                name: "RequestedBy",
                table: "JobRequests");

            migrationBuilder.RenameColumn(
                name: "SalaryRange",
                table: "JobRequests",
                newName: "RequesterName");

            migrationBuilder.AddColumn<string>(
                name: "DepartmentName",
                table: "JobRequests",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MaxSalary",
                table: "JobRequests",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MinSalary",
                table: "JobRequests",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DepartmentName",
                table: "JobRequests");

            migrationBuilder.DropColumn(
                name: "MaxSalary",
                table: "JobRequests");

            migrationBuilder.DropColumn(
                name: "MinSalary",
                table: "JobRequests");

            migrationBuilder.RenameColumn(
                name: "RequesterName",
                table: "JobRequests",
                newName: "SalaryRange");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "JobRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RequestedBy",
                table: "JobRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DepartmentId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobRequests_DepartmentId",
                table: "JobRequests",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_JobRequests_RequestedBy",
                table: "JobRequests",
                column: "RequestedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DepartmentId",
                table: "Users",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobRequests_Departments_DepartmentId",
                table: "JobRequests",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_JobRequests_Users_RequestedBy",
                table: "JobRequests",
                column: "RequestedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
